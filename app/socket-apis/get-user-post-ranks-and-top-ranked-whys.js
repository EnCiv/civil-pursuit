// https://github.com/EnCiv/civil-pursuit/issues/208
const Ranks = require('../models/ranks')
const getTopRankedWhysForPoint = require('./get-top-ranked-whys-for-point')

async function getUserPostRanksAndTopRankedWhys(discussionId, round, ids, cb) {
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
          discussionId: discussionId.toString(),
          round,
          stage: 'post',
          parentId: { $in: ids.map(id => id.toString()) },
        },
      },
    ]).toArray()

    // Remove userId for ranks not created by the current user
    const filteredRanks = ranks.map(({ userId, ...rest }) => (userId === this.synuser.id ? { userId, ...rest } : rest))

    // Fetch top-ranked whys for each point in ids
    const topWhys = await Promise.all(
      ids.map(async id => {
        return new Promise(resolve =>
          getTopRankedWhysForPoint.call(
            this,
            id.toString(),
            'most',
            0,
            1,
            whys => resolve(whys[0] || null) // Get the top-ranked why point
          )
        )
      })
    )

    // Filter out nulls from topWhys
    const filteredWhys = topWhys.filter(Boolean)

    cb({ ranks: filteredRanks, whys: filteredWhys })
  } catch (error) {
    console.error('Error in getUserPostRanksAndTopRankedWhys:', error)
    cb(undefined)
  }
}

module.exports = getUserPostRanksAndTopRankedWhys
