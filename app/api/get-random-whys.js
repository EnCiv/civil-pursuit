// https://github.com/EnCiv/civil-pursuit/issues/135

const Points = require('../models/points')

async function getRandomWhys(pointId, category, qty, cb) {
  try {
    const whys = await Points.aggregate([
      { $match: { parentId: pointId, category: category } },
      { $sample: { size: qty } },
    ]).exec()

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
