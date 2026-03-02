// https://github.com/EnCiv/civil-pursuit/issues/385

import { Iota } from 'civil-server'
import { ObjectId } from 'mongodb'
import Points from '../models/points'
import Dturns from '../models/dturns'
import { getConclusionIds } from '../dturn/dturn'

export default async function getUserDiscussions(cb) {
  if (typeof cb !== 'function') return

  // Check if user is logged in
  if (!this.synuser || !this.synuser.id) {
    logger.error('getUserDiscussions called but no user logged in')
    return cb(undefined)
  }

  try {
    // Find all points made by this user
    const userPoints = await Points.find({ userId: this.synuser.id }).toArray()

    // Extract unique parentIds (discussionIds) from those points
    const discussionIds = [...new Set(userPoints.map(point => point.parentId))]

    if (discussionIds.length === 0) {
      return cb([])
    }

    // Find all Iotas where discussionId is in that list
    const discussions = await Iota.find({
      _id: { $in: discussionIds.map(id => new ObjectId(id)) },
    }).toArray()

    // For each discussion, get round number from Dturns for this user
    const result = await Promise.all(
      discussions.map(async discussion => {
        const discussionId = discussion._id.toString()

        // Query Dturns to get user's highest round for this discussion
        const userDturn = await Dturns.findOne(
          {
            discussionId: discussionId,
            userId: this.synuser.id,
          },
          { sort: { round: -1 } }
        )

        // Get user's most recent activity in this discussion
        const userLastDturn = await Dturns.findOne(
          {
            discussionId: discussionId,
            userId: this.synuser.id,
          },
          { sort: { _id: -1 } }
        )

        const userLastActivity = userLastDturn ? userLastDturn._id.getTimestamp().toISOString() : null

        // Get most recent activity in this discussion (any user)
        const discussionLastDturn = await Dturns.findOne(
          {
            discussionId: discussionId,
          },
          { sort: { _id: -1 } }
        )

        const discussionLastActivity = discussionLastDturn ? discussionLastDturn._id.getTimestamp().toISOString() : null

        // Check if discussion is complete by getting conclusion data
        const conclusionIds = await getConclusionIds(discussionId)

        return {
          _id: discussionId,
          subject: discussion.subject,
          description: discussion.description,
          participants: discussion.webComponent?.participants || 0,
          currentRound: userDturn?.round || 0,
          isComplete: !!conclusionIds,
          userLastActivity: userLastActivity,
          discussionLastActivity: discussionLastActivity,
        }
      })
    )

    cb(result)
  } catch (error) {
    logger.error('Error in getUserDiscussions:', error)
    cb(undefined)
  }
}
