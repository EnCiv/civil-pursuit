// https://github.com/EnCiv/civil-pursuit/issues/XXX

import { Iota } from 'civil-server'
import { ObjectId } from 'mongodb'
import Dturns from '../models/dturns'

export default async function getUserDiscussions(cb) {
  if (typeof cb !== 'function') return

  try {
    // Mock data based on iotas.json structure for development/testing
    const mockDiscussions = [
      {
        discussionId: '5d56e411e7179a084eefb365',
        subject: 'Join',
        description: 'Join the Civil Server',
        numParticipants: 5,
        roundNum: 1,
      },
      {
        discussionId: '67db9da4c6019fba8de3eafe',
        subject: "What one issue should 'We the People' unite and solve first to make our country even better?",
        description: "This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. We're asking about concerns, not solutions.",
        numParticipants: 12,
        roundNum: 2,
      },
      {
        discussionId: '68687cdeb4e0c47144419fde',
        subject: "What's the largest number",
        description: "What's the largest random number between 0 and 100. This is a test of the Civil Server.",
        numParticipants: 8,
        roundNum: 3,
      },
    ]

    cb(mockDiscussions)

    // Original implementation commented out for development:
    /*
    // Validate authentication
    if (!this.synuser) {
      console.error('getUserDiscussions called but no user logged in')
      return cb(undefined)
    }

    const userId = this.synuser.id

    // Get all discussions where this user has participated
    const userDturns = await Dturns.find({ userId: userId }).toArray()

    if (!userDturns.length) {
      return cb([]) // User hasn't participated in any discussions
    }

    // Get unique discussion IDs
    const discussionIds = [...new Set(userDturns.map(dturn => dturn.discussionId))]

    // Get discussion details from Iotas collection
    const iotas = await Iota.find({
      _id: { $in: discussionIds.map(id => new ObjectId(id)) },
    }).toArray()

    // Get all Dturns data for these discussions to calculate participant counts
    const allDiscussionDturns = await Dturns.find({
      discussionId: { $in: discussionIds },
    }).toArray()

    // Build result by combining Iota metadata with Dturns participation data
    const discussions = iotas.map(iota => {
      const discussionId = iota._id.toString()

      // Get participant count from unique userIds in Dturns for this discussion
      const participantIds = [...new Set(allDiscussionDturns.filter(dturn => dturn.discussionId === discussionId).map(dturn => dturn.userId))]

      // Get user's highest round for this discussion
      const userRounds = userDturns
        .filter(dturn => dturn.discussionId === discussionId)
        .map(dturn => dturn.round)
        .filter(round => typeof round === 'number')

      const userMaxRound = userRounds.length > 0 ? Math.max(...userRounds) : 0

      return {
        discussionId,
        subject: iota.subject || '',
        description: iota.description || '',
        numParticipants: participantIds.length,
        roundNum: userMaxRound,
      }
    })

    cb(discussions)
    */
  } catch (error) {
    console.error('Error in getUserDiscussions:', error)
    cb(undefined)
  }
}
