// https://github.com/EnCiv/civil-pursuit/issues/203
const Points = require('../models/points')
const { ObjectId } = require('mongodb')

async function getPointsOfIds(ids, callback, currentUserId, synuser) {
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    if (callback) callback({ points: [], myWhys: [] }) // Return empty arrays on error
  }

  // Verify user is logged in.
  if (!synuser || !synuser.id) {
    console.log('User not logged in:', synuser)
    return cbFailure('Cannot retrieve points - user is not logged in.')
  }

  // Verify arguments
  if (!Array.isArray(ids) || ids.length === 0 || !currentUserId) {
    console.log('Invalid arguments:', { ids, currentUserId })
    return cbFailure(
      'Invalid arguments provided to getPointsOfIds(ids: Array, callback: Function, currentUserId: ObjectId).'
    )
  }

  try {
    console.log('Fetching points for ids:', ids)

    // Fetch points by _id
    const points = await Points.aggregate([{ $match: { _id: { $in: ids.map(id => new ObjectId(id)) } } }]).toArray()

    // For points, only keep userId if the point was created by the current user
    const filteredPoints = points.map(point => {
      const pointCopy = { ...point }
      if (pointCopy.userId !== currentUserId) {
        delete pointCopy.userId // Remove userId for points not created by the current user
      }
      return pointCopy
    })

    console.log('Filtered points:', filteredPoints)

    // Fetch why points where parentId is in the ids as string, and match by userId
    const whypoints = await Points.aggregate([
      {
        $match: {
          parentId: { $in: ids.map(id => id.toString()) }, // Convert parentId to string version of ObjectId
          userId: synuser.id // Match only the why points created by the current user
        }
      }
    ]).toArray()

    console.log('Fetched whypoints:', whypoints) // Log why points after fetching

    // Return points and whypoints as arrays
    callback({ points: filteredPoints, myWhys: whypoints })
  } catch (error) {
    console.error('Error fetching points or whypoints:', error)
    cbFailure('Error fetching points or whypoints.')
  }
}

module.exports = getPointsOfIds
