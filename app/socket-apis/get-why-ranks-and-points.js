// https://github.com/EnCiv/civil-pursuit/issues/207

const Points = require('../models/points')
const Ranks = require('../models/ranks')
import randomWhys from './randomWhys'

async function getWhyRanksAndPoints(discussionId, round, mostIds, leastIds, cb) {
  // Verify that the user is logged in
  if (!this.synuser || !this.synuser.id) {
    console.error('User not logged in')
    return cb && cb({ ranks: [], points: [] })
  }

  // Check that all required parameters are provided
  if (!discussionId || !round || !mostIds || !leastIds) {
    console.error('Missing or invalid parameters')
    return cb && cb({ ranks: [], points: [] })
  }

  try {
    const userId = this.synuser.id

    // Fetch ranks based on discussionId, round, userId, and stage
    const ranks = await Ranks.find({ discussionId, round, userId, stage: 'why' }).toArray()

    // If no ranks are found, return early with empty arrays
    if (!ranks.length) return cb({ ranks: [], points: [] })

    // Fetch points based on whether their parentId matches any of the mostIds or leastIds
    const points = await Points.find({ parentId: { $in: mostIds.concat(leastIds) } }).toArray()

    // Check if all mostIds and leastIds have corresponding points
    if (hasAllRequiredPoints(mostIds, leastIds, points)) {
      // If all required points are found, return ranks and points
      return cb({ ranks, points })
    }

    // If some points are missing, fetch random Whys for each mostId and leastId in parallel
    const [mostWhys, leastWhys] = await Promise.all([randomWhys(mostIds, 'most', 5), randomWhys(leastIds, 'least', 5)])

    // Combine random whys for both mostIds and leastIds
    const allWhys = [...mostWhys, ...leastWhys]
    const allWhysIds = allWhys.map(why => why._id)

    // Fetch points based on the random whys fetched
    const allWhysPoints = await Points.find({ parentId: { $in: allWhysIds } }).toArray()

    // Return ranks and points fetched from random whys
    return cb({ ranks, points: allWhysPoints })
  } catch (error) {
    // Catch any error and log it
    console.error('Error in getWhyRanksAndPoints:', error.message)
    cb({ ranks: [], points: [] })
  }
}

// Helper function to check if all provided IDs have corresponding points.
function hasAllRequiredPoints(mostIds, leastIds, points) {
  // Create a Set of parentIds from points for fast lookup
  const pointsMap = new Set(points.map(point => point.parentId))

  // Check if every mostId and leastId has a corresponding entry in pointsMap
  return mostIds.every(id => pointsMap.has(id)) && leastIds.every(id => pointsMap.has(id))
}

module.exports = getWhyRanksAndPoints
