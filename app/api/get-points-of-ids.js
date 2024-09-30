const Points = require('../models/points')
const { ObjectId } = require('mongodb')

async function getPointsOfIds(ids, callback) {
  try {
    // Fetch points by _id
    const points = await Points.aggregate([{ $match: { _id: { $in: ids.map(id => new ObjectId(id)) } } }]).toArray()

    // Fetch why points where parentId is in the ids
    const whypoints = await Points.aggregate([
      { $match: { parentId: { $in: ids.map(id => new ObjectId(id)) } } },
    ]).toArray()

    // Reduce points into an object
    const pointById = points.reduce((acc, point) => {
      acc[point._id.toHexString()] = point
      return acc
    }, {})

    // Reduce whypoints into an object with parentId as keys
    const myWhysByParentId = whypoints.reduce((acc, whyPoint) => {
      const parentId = whyPoint.parentId.toHexString()
      if (!acc[parentId]) {
        acc[parentId] = []
      }
      acc[parentId].push(whyPoint)
      return acc
    }, {})

    // Return points and whypoints
    callback({ points: pointById, myWhys: myWhysByParentId })
  } catch (error) {
    console.error('Error fetching points or whypoints:', error)
    callback({ points: {}, myWhys: {} }) // Return empty objects on error
  }
}

module.exports = getPointsOfIds
