// https://github.com/EnCiv/civil-pursuit/issues/135

const Points = require('../models/points')

async function getRandomWhys(pointId, category, qty, cb) {
  if (!this.synuser || !this.synuser.id) {
    console.error('getRandomWhys called but no user logged in')
    return cb && cb(undefined)
  }

  if (!pointId || !category || !qty || typeof qty !== 'number') {
    console.error('getRandomWhys called with missing or invalid parameters')
    return cb && cb(undefined)
  }

  try {
    const whys = await Points.aggregate([
      { $match: { parentId: pointId.toString(), category: category } }, // Ensure parentId is a string in the match query
      { $sample: { size: qty } },
    ]).toArray()

    const result = whys.map(why => {
      const { userId, ...rest } = why
      return rest
    })

    cb(result)
  } catch (error) {
    console.error('Error in getRandomWhys:', error)
    cb(undefined)
  }
}

module.exports = getRandomWhys
