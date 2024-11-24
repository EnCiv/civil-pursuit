// https://github.com/EnCiv/civil-pursuit/issues/207

// https://github.com/EnCiv/civil-pursuit/issues/207

const Points = require('../models/points')
const Ranks = require('../models/ranks')
const getRandomWhys = require('./get-random-whys')

const WHY_FETCH_COUNT = 5 // Number of "whys" to fetch when an ID has none

async function getWhyRanksAndPoints(discussionId, round, mostIds, leastIds, cb) {
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    if (cb) cb({ ranks: [], whys: [] })
  }

  if (!this.synuser || !this.synuser.id) {
    return cbFailure('Cannot retrieve whys - user is not logged in.')
  }

  if (!discussionId || typeof round !== 'number' || !Array.isArray(mostIds) || !Array.isArray(leastIds)) {
    return cbFailure('Invalid argument provided to getWhyRanksAndPoints.')
  }

  try {
    const userId = this.synuser.id

    // Step 1: Fetch ranks
    const ranks = await Ranks.find({
      discussionId,
      round,
      userId,
      stage: 'why',
    }).toArray()

    // Fetch random whys directly if no ranks exist
    if (ranks.length === 0) {
      console.log('Ranks are empty. Fetching random whys directly.')
      const mostWhysPromises = mostIds.map(id => new Promise(resolve => getRandomWhys.call(this, id, 'most', WHY_FETCH_COUNT, resolve)))
      const leastWhysPromises = leastIds.map(id => new Promise(resolve => getRandomWhys.call(this, id, 'least', WHY_FETCH_COUNT, resolve)))

      const mostWhys = (await Promise.all(mostWhysPromises)).flat()
      const leastWhys = (await Promise.all(leastWhysPromises)).flat()

      return cb({ ranks: [], whys: [...mostWhys, ...leastWhys] })
    }

    // Step 2: Extract parentIds from ranks
    const parentIds = ranks.map(rank => rank.parentId)

    // Step 3: Fetch points based on parentIds
    const points = await Points.find({ _id: { $in: parentIds } }).toArray()

    // Step 4: Check if all mostIds and leastIds have corresponding why-points
    const pointsWithWhys = new Set(points.map(point => point.parentId))

    const missingMostIds = mostIds.filter(id => !pointsWithWhys.has(id))
    console.log('missingMostIds:', missingMostIds)
    const missingLeastIds = leastIds.filter(id => !pointsWithWhys.has(id))
    console.log('missingLeastIds:', missingLeastIds)

    if (!missingMostIds.length && !missingLeastIds.length) {
      console.log('All mostIds and leastIds have corresponding why-points.')
      // If all parentIds have corresponding why-points, return ranks and points
      return cb({ ranks, whys: points })
    }

    // Step 5: Fetch missing whys using getRandomWhys
    const mostWhysPromises = missingMostIds.map(id => new Promise(resolve => getRandomWhys.call(this, id, 'most', WHY_FETCH_COUNT, resolve)))
    const leastWhysPromises = missingLeastIds.map(id => new Promise(resolve => getRandomWhys.call(this, id, 'least', WHY_FETCH_COUNT, resolve)))

    const mostWhys = (await Promise.all(mostWhysPromises)).flat()
    const leastWhys = (await Promise.all(leastWhysPromises)).flat()

    const allWhys = [...mostWhys, ...leastWhys]

    // Combine existing and new points
    return cb({ ranks, whys: allWhys })
  } catch (error) {
    return cbFailure('Failed to retrieve ranks and points.')
  }
}

module.exports = getWhyRanksAndPoints
