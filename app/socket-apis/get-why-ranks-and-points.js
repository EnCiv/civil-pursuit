// https://github.com/EnCiv/civil-pursuit/issues/207

const Points = require('../models/points')
const Ranks = require('../models/ranks')
import getRandomWhys from './get-random-whys'

const WHY_FETCH_COUNT = 5 // Number of "whys" to fetch when an ID has none

async function getWhyRanksAndPoints(discussionId, round, mostIds, leastIds, cb) {
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    if (cb) cb(undefined)
  }

  if (!this.synuser || !this.synuser.id) {
    return cbFailure('Cannot retrieve whys - user is not logged in.')
  }

  if (!discussionId || !round || !mostIds || !leastIds) {
    return cbFailure('Invalid argument provided to getWhyRanksAndPoints(discussionId: String, round: Number, mostIds: Array, leastIds: Array, cb: Function).')
  }

  try {
    const userId = this.synuser.id
    const ranks = await Ranks.find({ discussionId, round, userId, stage: 'why' }).toArray()
    if (ranks.length == 0) return cb({ ranks: [], points: [] })

    // Fetch points and track the IDs that already have "whys"
    const points = await Points.find({ parentId: { $in: mostIds.concat(leastIds) }, userId: userId }).toArray()
    const pointsWithWhys = new Set(points.map(point => point.parentId))

    // Filter IDs that have no "whys"
    const missingMostIds = mostIds.filter(id => !pointsWithWhys.has(id))
    const missingLeastIds = leastIds.filter(id => !pointsWithWhys.has(id))

    // If all IDs already have "whys," return the existing points and ranks
    if (!missingMostIds.length && !missingLeastIds.length) {
      return cb({ ranks, points })
    }

    // Fetch "whys" for each missing ID in parallel
    const mostWhysPromises = missingMostIds.map(id => new Promise(resolve => getRandomWhys.call(this, id, 'most', WHY_FETCH_COUNT, resolve)))
    const leastWhysPromises = missingLeastIds.map(id => new Promise(resolve => getRandomWhys.call(this, id, 'least', WHY_FETCH_COUNT, resolve)))

    // Wait for all random whys to be fetched
    const mostWhys = (await Promise.all(mostWhysPromises)).flat()
    const leastWhys = (await Promise.all(leastWhysPromises)).flat()

    const allWhys = [...mostWhys, ...leastWhys]
    const allWhysIds = allWhys.map(why => why._id)
    const allWhysPoints = await Points.find({ parentId: { $in: allWhysIds } }).toArray()

    // Combine existing points and new points from random "whys"
    return cb({ ranks, points: points.concat(allWhysPoints) })
  } catch (error) {
    return cbFailure('Failed to retrieve ranks and points.')
  }
}

module.exports = getWhyRanksAndPoints
