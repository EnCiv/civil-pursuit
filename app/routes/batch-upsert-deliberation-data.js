// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md
// HTTP Route for batch upsert deliberation data - allows cookie update after email association

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
 * HTTP Route version of batch-upsert-deliberation-data
 *
 * This route is used instead of the socket API when we need to update the user's cookie
 * after associating an email with a temporary user account.
 *
 * The key difference from the socket API version:
 * - Uses req.cookies.synuser for authentication (instead of this.synuser)
 * - Sets req.user after email association so setUserCookie middleware updates the cookie
 * - Returns JSON response instead of callback
 */

// Validation schemas (same as socket API)
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

export async function batchUpsertHandler(req, res, next) {
  const sendError = (statusCode, errorMsg) => {
    console.error('batch-upsert-deliberation-data route:', errorMsg)
    res.status(statusCode).json({ error: errorMsg })
  }

  // Verify user is logged in via cookie
  const synuser = req.cookies?.synuser
  if (!synuser || !synuser.id) {
    return sendError(401, 'User is not logged in')
  }

  const userId = synuser.id
  const batchData = req.body

  // Validate batch data structure
  if (!batchData || typeof batchData !== 'object') {
    return sendError(400, 'Invalid batch data format')
  }

  const { discussionId, round, email, data } = batchData

  // Validate discussionId
  const { error: idError } = joiObjectId().required().validate(discussionId)
  if (idError) {
    return sendError(400, 'Invalid discussionId')
  }

  if (typeof round !== 'number' || round < 0) {
    return sendError(400, 'Invalid round number')
  }

  if (!data || typeof data !== 'object') {
    return sendError(400, 'Invalid data object')
  }

  try {
    // Check if round already finished (idempotency)
    const discussionStatus = await getDiscussionStatus(discussionId, userId)
    if (discussionStatus?.uInfo?.[round]?.finished) {
      console.info('batch-upsert-deliberation-data route: Round already finished, returning success')
      return res.json({ success: true, message: 'Round already completed', points: 0, whys: 0, ranks: 0 })
    }

    // Step 1: Associate email with userId if provided
    let emailUpdated = false
    if (email && typeof email === 'string') {
      try {
        await User.updateOne({ _id: new User.ObjectId(userId) }, { $set: { email } })
        emailUpdated = true

        // Set req.user so setUserCookie middleware will update the cookie with email
        req.user = { _id: userId, email }
      } catch (error) {
        console.error('batch-upsert-deliberation-data route: Error updating user email:', error.message || error)
        return sendError(500, 'Failed to associate email with user')
      }
    }

    // Step 2: Prepare and validate data arrays
    // Use myPointById (filtered by client to only include user's own points)
    // Filter for points with userId matching the cookie's userId or 'unknown'
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
      console.error(`batch-upsert-deliberation-data route: User ${userId} attempted to insert ${points.length} points, only 1 allowed`, { discussionId, round, userId, pointIds: points.map(p => p._id) })
      return sendError(400, 'Only one statement allowed per user in Round 0')
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

    // Validate idRanks - must be an array if provided
    if (idRanks !== undefined && !Array.isArray(idRanks)) {
      return sendError(400, 'idRanks must be an array if provided')
    }

    // Step 3: Validate all points
    for (const point of points) {
      const { error } = pointSchema.validate(point)
      if (error) {
        return sendError(400, `Point validation failed: ${error.message}`)
      }
      point._id = new ObjectId(point._id)
    }

    // Step 4: Validate all whys
    for (const why of whys) {
      why.userId = userId
      const { error } = whySchema.validate(why)
      if (error) {
        return sendError(400, `Why validation failed: ${error.message}`)
      }
      why._id = new ObjectId(why._id)
    }

    // Step 5: Validate all ranks
    for (const rank of ranks) {
      rank.userId = userId
      const { error } = rankSchema.validate(rank)
      if (error) {
        return sendError(400, `Rank validation failed: ${error.message}`)
      }
      rank._id = rank._id ? new ObjectId(rank._id) : new ObjectId()
    }

    // Step 6: Insert user's statement into dturn (if they have one)
    if (points.length > 0) {
      const point = points[0]
      const statementId = point._id.toString()
      const insertResult = await insertStatementId(discussionId, userId, statementId)
      if (!insertResult) {
        console.error(`batch-upsert-deliberation-data route: Failed to insert statement into dturn`, { discussionId, userId, statementId })
        return sendError(500, 'Failed to insert statement into discussion')
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
    if (idRanks && idRanks.length > 0) {
      await dturnFinishRound(discussionId, round, userId, idRanks, groupings || [])
    }

    // If email was updated, continue to setUserCookie middleware
    // Otherwise, send response directly
    if (emailUpdated) {
      // Store result for final handler
      req.batchUpsertResult = {
        success: true,
        points: points.length,
        whys: whys.length,
        ranks: ranks.length,
      }
      next()
    } else {
      res.json({
        success: true,
        points: points.length,
        whys: whys.length,
        ranks: ranks.length,
      })
    }
  } catch (error) {
    console.error('batch-upsert-deliberation-data route: Unexpected error:', error)
    return sendError(500, 'An unexpected error occurred')
  }
}

// Final handler to send response after cookie is set
function sendBatchUpsertResult(req, res) {
  res.json(req.batchUpsertResult)
}

export default function route() {
  // POST /api/batch-upsert-deliberation-data
  // Uses setUserCookie middleware to update cookie after email association
  this.app.post('/api/batch-upsert-deliberation-data', batchUpsertHandler, this.setUserCookie, sendBatchUpsertResult)
}
