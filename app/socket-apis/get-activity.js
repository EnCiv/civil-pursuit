// https://github.com/EnCiv/civil-pursuit/issues/XXX

import { Iota } from 'civil-server'
import { ObjectId } from 'mongodb'
import Points from '../models/points'
import Ranks from '../models/ranks'

export default async function getActivity(discussionId, cb) {
  if (typeof cb !== 'function') return

  try {
    // Validate authentication
    if (!this.synuser) {
      console.error('getActivity called but no user logged in')
      return cb(undefined)
    }

    if (!discussionId) {
      return cb(undefined)
    }

    const userId = this.synuser.id

    // Find the iota with the given discussionId
    const iota = await Iota.findOne({ _id: new ObjectId(discussionId) })

    if (!iota) {
      console.error('Iota not found for discussionId:', discussionId)
      return cb(undefined)
    }

    // Find the user's response (point where parentId equals discussionId and userId equals current user)
    const userResponse = await Points.findOne({
      parentId: discussionId,
      userId: userId,
    })

    // Count ranks for the user's response if it exists
    let rankCounts = null
    if (userResponse) {
      const rankAggregation = await Ranks.aggregate([
        { $match: { parentId: userResponse._id.toString() } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
      ]).toArray()

      // Initialize counts and populate from aggregation results
      rankCounts = { mosts: 0, leasts: 0, neutrals: 0 }
      rankAggregation.forEach(item => {
        if (item._id === 'most') rankCounts.mosts = item.count
        else if (item._id === 'least') rankCounts.leasts = item.count
        else if (item._id === 'neutral') rankCounts.neutrals = item.count
      })
    }

    // Get user's ranks for all points in the discussion
    const userRanks = await Ranks.aggregate([
      {
        $match: {
          discussionId: discussionId,
          userId: userId,
          stage: { $in: ['pre', 'post'] },
        },
      },
      {
        $group: {
          _id: { parentId: '$parentId', round: '$round' },
          ranks: {
            $push: {
              stage: '$stage',
              category: '$category',
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.round',
          entries: {
            $push: {
              parentId: '$_id.parentId',
              ranks: '$ranks',
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).toArray()

    // Get the points for user ranks and format the result by rounds
    const allPointIds = []
    userRanks.forEach(round => {
      round.entries.forEach(entry => {
        allPointIds.push(new ObjectId(entry.parentId))
      })
    })

    const points = allPointIds.length > 0 ? await Points.find({ _id: { $in: allPointIds } }).toArray() : []

    const userRanksByRound = userRanks.map(round => {
      return round.entries
        .map(entry => {
          const point = points.find(p => p._id.toString() === entry.parentId)
          if (!point) return null

          const preRank = entry.ranks.find(r => r.stage === 'pre')
          const postRank = entry.ranks.find(r => r.stage === 'post')

          return {
            point: {
              subject: point.subject,
              description: point.description,
            },
            pre: preRank ? preRank.category : null,
            post: postRank ? postRank.category : null,
          }
        })
        .filter(Boolean)
    })

    // Return the subject, description, user response, rank counts, and user ranks organized by rounds
    const result = {
      subject: iota.subject || '',
      description: iota.description || '',
      userResponse: userResponse || null,
      rankCounts: rankCounts,
      userRanks: userRanksByRound,
    }

    cb(result)
  } catch (error) {
    console.error('Error in getActivity:', error)
    cb(undefined)
  }
}
