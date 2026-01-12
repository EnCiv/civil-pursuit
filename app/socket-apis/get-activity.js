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

    // Return the subject, description, user response, and rank counts
    const result = {
      subject: iota.subject || '',
      description: iota.description || '',
      userResponse: userResponse || null,
      rankCounts: rankCounts,
    }

    cb(result)
  } catch (error) {
    console.error('Error in getActivity:', error)
    cb(undefined)
  }
}
