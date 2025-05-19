// https://github.com/EnCiv/civil-pursuit/issues/208
import Ranks from '../models/ranks'
import getTopRankedWhysForPoint from './get-top-ranked-whys-for-point'

export default async function getUserPostRanksAndTopRankedWhys(discussionId, round, ids, cb) {
  if (!this.synuser || !this.synuser.id) {
    console.error('getUserPostRanksAndTopRankedWhys called but no user logged in')
    return cb && cb(undefined)
  }

  if (!discussionId || typeof round !== 'number' || !Array.isArray(ids) || ids.length === 0) {
    console.error('getUserPostRanksAndTopRankedWhys called with invalid parameters')
    return cb && cb(undefined)
  }

  try {
    // Fetch ranks for discussionId, round, and stage 'post'
    const ranks = await Ranks.aggregate([
      {
        $match: {
          discussionId: discussionId,
          round,
          stage: 'post',
          parentId: { $in: ids },
          userId: this.synuser.id,
        },
      },
    ]).toArray()

    // Remove userId for ranks not created by the current user
    const filteredRanks = ranks.map(({ userId, ...rest }) => (userId === this.synuser.id ? { userId, ...rest } : rest))

    // Fetch top-ranked whys for each point in ids
    const topWhys = await Promise.all(
      ids.map(id => {
        return new Promise(resolve =>
          getTopRankedWhysForPoint.call(
            this,
            id,
            'most',
            0,
            5,
            whys => resolve(whys || null) // Get the top-ranked why point
          )
        )
      })
    )

    // Filter out nulls from topWhys
    const filteredWhys = topWhys.filter(Boolean).flat()

    cb({ ranks: filteredRanks, whys: filteredWhys })
  } catch (error) {
    console.error('Error in getUserPostRanksAndTopRankedWhys:', error)
    cb(undefined)
  }
}
