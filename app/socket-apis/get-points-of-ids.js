// https://github.com/EnCiv/civil-pursuit/issues/203
const Points = require('../models/points')
const { ObjectId } = require('mongodb')

async function getPointsOfIds(ids, callback) {
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    if (callback) callback(undefined) // Pass undefined to callback on error
  }

  // Verify user is logged in
  if (!this.synuser || !this.synuser.id) {
    // console.log('User not logged in')
    return cbFailure('Cannot retrieve points - user is not logged in.')
  }

  // Verify arguments
  if (!Array.isArray(ids) || ids.length === 0) {
    // console.log('Invalid arguments:', { ids })
    return cbFailure('Invalid arguments provided to getPointsOfIds(ids: Array, callback: Function).')
  }

  try {
    // console.log('Fetching points for ids:', ids)

    // Fetch points by _id
    const points = await Points.aggregate([{ $match: { _id: { $in: ids.map(id => new ObjectId(id)) } } }]).toArray()

    // Filter userId only for points created by the current user
    const filteredPoints = points.map(point => {
      if (point.userId !== this.synuser.id) {
        delete point.userId // Remove userId for points not created by the current user
      }
      return point
    })

    // console.log('Filtered points:', filteredPoints)

    // Fetch why points where parentId is in the ids and match by userId
    const whypoints = await Points.aggregate([
      {
        $match: {
          parentId: { $in: ids.map(id => id.toString()) },
          userId: this.synuser.id
        }
      }
    ]).toArray()

    // console.log('Fetched whypoints:', whypoints)

    // Return points and whypoints directly as arrays
    callback({points: filteredPoints, myWhys: whypoints})
  } catch (error) {
    console.error('Error fetching points or whypoints:', error)
    cbFailure('Error fetching points or whypoints.')
  }
}

module.exports = getPointsOfIds
