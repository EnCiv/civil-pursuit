const Points = require('../models/points')
const { ObjectId } = require('mongodb')

async function getPointsOfIds(ids, callback, currentUserId) {
  try {
    // Fetch points by _id
    const points = await Points.aggregate([{ $match: { _id: { $in: ids.map(id => new ObjectId(id)) } } }]).toArray()

    // Fetch why points where parentId is in the ids
    const whypoints = await Points.aggregate([
      { $match: { parentId: { $in: ids.map(id => new ObjectId(id)) } } },
    ]).toArray()

    // Reduce points into an object
    const pointById = points.reduce((acc, point) => {
      const pointCopy = { ...point }
      // Only remove userId if the point was not created by the current user
      if (point.userId && point.userId !== currentUserId) {
        delete pointCopy.userId
      }
      acc[point._id.toHexString()] = pointCopy
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
