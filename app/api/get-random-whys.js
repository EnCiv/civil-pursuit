// https://github.com/EnCiv/civil-pursuit/issues/135

const Points = require('../models/points')
const { ObjectId } = require('mongodb') // Add this line

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
    // console.log('Getting existing whys')
    // console.log(`Querying for pointId: ${pointId}, category: ${category}, qty: ${qty}`)
    
    const whys = await Points.aggregate([
      { $match: { parentId: new ObjectId(pointId), category: category } },
      { $sample: { size: qty } },
    ]).toArray()

    // console.log('Whys retrieved:', whys)

    const result = whys.map(why => {
      const { userId, ...rest } = why
      return rest
    })

    // console.log('Resulting whys:', result)
    cb(result)
  } catch (error) {
    console.error('Error in getRandomWhys:', error)
    cb(undefined)
  }
}

module.exports = getRandomWhys
