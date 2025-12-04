// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md
// Batch upsert deliberation data for Late Sign-Up feature

'use strict'

import Joi from 'joi'
import JoiObjectId from 'joi-objectid'
import { ObjectId } from 'mongodb'
import Points from '../models/points'

const joiObjectId = JoiObjectId(Joi)
import Ranks from '../models/ranks'
import Jsforms from '../models/jsforms'
import { User } from 'civil-server'
import { finishRound as dturnFinishRound, getDiscussionStatus, insertStatementId } from '../dturn/dturn'

/**
 * Batch upsert deliberation data from localStorage for temporary users
 *
 * This API accepts all accumulated data from a completed round and:
 * 1. Associates email with temporary userId
 * 2. Validates all data using Joi schemas (ensures only 1 point allowed)
 * 3. Inserts user's statement into dturn via insertStatementId
 * 4. Upserts points, whys, ranks, and jsform data to database
 * 5. Calls finish-round logic (only if idRanks has data)
 * 6. Returns success with counts
 *
 * **Early User Scenario:**
 * The first few users in a deliberation won't have enough statements to rank or group yet.
 * In these cases, `postRankByParentId` will be empty, and `groupIdsLists` and `idRanks` will be
 * **undefined** (not empty arrays) to indicate the user hasn't been shown items to rank/group yet.
 *
 * **Empty array `[]` means incomplete**: If the user was shown `group_size` items to rank but
 * `idRanks` is empty, the user has NOT completed the ranking step. They must rank the items
 * to complete the round.
 *
 * **finishRound is only called when `idRanks` has length > 0**, meaning the user has actually
 * completed ranking. If `idRanks` is undefined or empty, the round is NOT marked as finished,
 * allowing the user to return later and complete ranking/grouping steps.
 *
 * These users can return later to complete ranking/grouping steps, at which point this API
 * will be called again with the same `pointById` and `myWhyByCategoryByParentId` (already in DB)
 * plus new `postRankByParentId`, `groupIdsLists`, and `idRanks` data. The upsert operations
 * handle this gracefully - existing documents are not duplicated.
 *
 * Parameters:
 * - `batchData.discussionId` - The discussion ID
 * - `batchData.round` - The round number (0-based)
 * - `batchData.email` - Optional email to associate with userId
 * - `batchData.data.pointById` - Object of points by ID (max 1 point allowed per user)
 * - `batchData.data.myWhyByCategoryByParentId` - Object of whys by category by parent ID
 * - `batchData.data.postRankByParentId` - Object of ranks by parent ID (empty for early users)
 * - `batchData.data.groupIdsLists` - Array of groupings (undefined if not shown yet, [] if incomplete)
 * - `batchData.data.jsformData` - Object of jsform data by form name
 * - `batchData.data.idRanks` - Array of idRanks (undefined if not shown yet, [] if incomplete, populated when done)
 *
 * Callback: Called with result object or undefined on error
 */

// Validation schemas
const pointSchema = Joi.object({
  _id: joiObjectId().required(),
  subject: Joi.string().required(),
  description: Joi.string().required(),
  parentId: joiObjectId().required(),
  userId: Joi.string().required(),
})

const whySchema = Joi.object({
  _id: joiObjectId().required(),
  subject: Joi.string().required(),
  description: Joi.string().required(),
  parentId: joiObjectId().required(),
  userId: Joi.string().required(),
  category: Joi.string().valid('most', 'least', 'neutral').required(),
})

const rankSchema = Joi.object({
  _id: joiObjectId().optional(),
  stage: Joi.string().valid('pre', 'post', 'why').required(),
  category: Joi.string().valid('most', 'least', 'neutral', '').optional(),
  parentId: joiObjectId().required(),
  userId: Joi.string().required(),
  discussionId: joiObjectId().required(),
  round: Joi.number().integer().min(0).required(),
})

export default async function batchUpsertDeliberationData(batchData, cb) {
  const cbFailure = errorMsg => {
    if (errorMsg) console.error('batch-upsert-deliberation-data:', errorMsg)
    cb?.({ error: errorMsg || 'An error occurred during batch upsert' })
  }

  // Verify user is logged in
  if (!this.synuser || !this.synuser.id) {
    return cbFailure('User is not logged in')
  }

  const userId = this.synuser.id

  // Validate batch data structure
  if (!batchData || typeof batchData !== 'object') {
    return cbFailure('Invalid batch data format')
  }

  const { discussionId, round, email, data } = batchData

  // Validate discussionId
  const { error: idError } = joiObjectId().required().validate(discussionId)
  if (idError) {
    return cbFailure('Invalid discussionId')
  }

  if (typeof round !== 'number' || round < 0) {
    return cbFailure('Invalid round number')
  }

  if (!data || typeof data !== 'object') {
    return cbFailure('Invalid data object')
  }

  try {
    // Check if round already finished (idempotency)
    const discussionStatus = getDiscussionStatus(discussionId, userId)
    if (discussionStatus?.uInfo?.[round]?.finished) {
      console.info('batch-upsert-deliberation-data: Round already finished, returning success')
      return cb?.({ success: true, message: 'Round already completed', points: 0, whys: 0, ranks: 0 })
    }

    // Step 1: Associate email with userId if provided
    if (email && typeof email === 'string') {
      try {
        await User.updateOne({ _id: new User.ObjectId(userId) }, { $set: { email } })
      } catch (error) {
        console.error('batch-upsert-deliberation-data: Error updating user email:', error.message || error)
        return cbFailure('Failed to associate email with user')
      }
    }

    // Step 2: Prepare and validate data arrays
    // Use myPointById (filtered by client to only include user's own points)
    // Filter for points with userId matching the socket's userId or 'unknown'
    const allPoints = Object.values(data.myPointById || {})
    const points = allPoints.filter(point => point.userId === userId || point.userId === 'unknown')

    // Update 'unknown' userId to actual userId
    for (const point of points) {
      if (point.userId === 'unknown') {
        point.userId = userId
      }
    }

    // Validate that user has only inserted one statement (their answer)
    if (points.length > 1) {
      console.error(`batch-upsert-deliberation-data: User ${userId} attempted to insert ${points.length} points, only 1 allowed`, { discussionId, round, userId, pointIds: points.map(p => p._id) })
      return cbFailure('Only one statement allowed per user in Round 0')
    }

    const whys = []
    for (const category in data.myWhyByCategoryByParentId || {}) {
      for (const parentId in data.myWhyByCategoryByParentId[category]) {
        const why = data.myWhyByCategoryByParentId[category][parentId]
        if (why) {
          whys.push({ ...why, category })
        }
      }
    }
    const ranks = Object.values(data.postRankByParentId || {})
    const groupings = data.groupIdsLists // Can be undefined if not done yet
    const jsformData = data.jsformData || {}
    const idRanks = data.idRanks // Can be undefined if not done yet

    // Validate idRanks - must be an array if provided, can be undefined if user hasn't done ranking yet
    if (idRanks !== undefined && !Array.isArray(idRanks)) {
      return cbFailure('idRanks must be an array if provided')
    }

    // Step 3: Validate all points
    // Note: userId was already set to actual userId above (replacing 'unknown')
    for (const point of points) {
      const { error } = pointSchema.validate(point)
      if (error) {
        return cbFailure(`Point validation failed: ${error.message}`)
      }
      // Convert _id to ObjectId after validation
      point._id = new ObjectId(point._id)
    }

    // Step 4: Validate all whys
    for (const why of whys) {
      why.userId = userId // Ensure userId is set
      const { error } = whySchema.validate(why)
      if (error) {
        return cbFailure(`Why validation failed: ${error.message}`)
      }
      // Convert _id to ObjectId after validation
      why._id = new ObjectId(why._id)
    }

    // Step 5: Validate all ranks
    for (const rank of ranks) {
      rank.userId = userId // Ensure userId is set
      const { error } = rankSchema.validate(rank)
      if (error) {
        return cbFailure(`Rank validation failed: ${error.message}`)
      }
      // Convert _id to ObjectId after validation
      rank._id = rank._id ? new ObjectId(rank._id) : new ObjectId()
    }

    // TODO: Phase 2 - Add MongoDB transactions when replica set is available
    // const session = await Mongo.client.startSession()
    // try {
    //   await session.withTransaction(async () => {
    //     await Points.bulkWrite(pointOps, { session })
    //     await Points.bulkWrite(whyOps, { session })
    //     await Ranks.bulkWrite(rankOps, { session })
    //     await dturnFinishRound(discussionId, round, userId, idRanks, groupings, { session })
    //   })
    // } finally {
    //   await session.endSession()
    // }

    // Step 6: Insert user's statement into dturn (if they have one)
    if (points.length > 0) {
      const point = points[0]
      const statementId = point._id.toString()
      const insertResult = await insertStatementId(discussionId, userId, statementId)
      if (!insertResult) {
        console.error(`batch-upsert-deliberation-data: Failed to insert statement into dturn`, { discussionId, userId, statementId })
        return cbFailure('Failed to insert statement into discussion')
      }
    }

    // Step 7: Upsert points using bulk operations
    if (points.length > 0) {
      const pointOps = points.map(point => ({
        updateOne: {
          filter: { _id: point._id },
          update: { $set: point },
          upsert: true,
        },
      }))
      await Points.bulkWrite(pointOps)
    }

    // Step 8: Upsert whys (also in Points collection with category)
    if (whys.length > 0) {
      const whyOps = whys.map(why => ({
        updateOne: {
          filter: { _id: why._id },
          update: { $set: why },
          upsert: true,
        },
      }))
      await Points.bulkWrite(whyOps)
    }

    // Step 9: Upsert ranks
    if (ranks.length > 0) {
      const rankOps = ranks.map(rank => ({
        updateOne: {
          filter: { _id: rank._id },
          update: { $set: rank },
          upsert: true,
        },
      }))
      await Ranks.bulkWrite(rankOps)
    }

    // Step 10: Upsert jsform data
    for (const [formName, formObj] of Object.entries(jsformData)) {
      if (formObj && typeof formObj === 'object') {
        await Jsforms.updateOne({ parentId: discussionId, userId }, { $set: { [formName]: formObj } }, { upsert: true })
      }
    }

    // Step 11: Call finish-round logic only if user has completed ranking
    // If idRanks is undefined or empty, the user hasn't finished ranking yet (early users)
    if (idRanks && idRanks.length > 0) {
      await dturnFinishRound(discussionId, round, userId, idRanks, groupings || [])
    }

    // Success!
    cb?.({
      success: true,
      points: points.length,
      whys: whys.length,
      ranks: ranks.length,
    })
  } catch (error) {
    console.error('batch-upsert-deliberation-data: Unexpected error:', error)
    return cbFailure('An unexpected error occurred')
  }
}
