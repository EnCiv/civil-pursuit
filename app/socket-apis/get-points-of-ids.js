// https://github.com/EnCiv/civil-pursuit/issues/203
const Points = require('../models/points')
const { ObjectId } = require('mongodb')

async function getPointsOfIds(ids, callback) {
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    if (callback) callback({ points: [], myWhys: [] }) // Return empty arrays on error
  }

  // Verify user is logged in by checking synuser in ids
  const synuser = ids.find(id => typeof id === 'object' && id.synuser)
  if (!synuser || !synuser.synuser || !synuser.synuser.id) {
    console.log('User not logged in:', synuser)
    return cbFailure('Cannot retrieve points - user is not logged in.')
  }

  // Remove synuser object from ids array
  const filteredIds = ids.filter(id => !(typeof id === 'object' && id.synuser))

  // Verify arguments
  if (!Array.isArray(filteredIds) || filteredIds.length === 0) {
    console.log('Invalid arguments:', { ids })
    return cbFailure('Invalid arguments provided to getPointsOfIds(ids: Array, callback: Function).')
  }

  try {
    console.log('Fetching points for ids:', filteredIds)

    // Fetch points by _id
    const points = await Points.aggregate([{ $match: { _id: { $in: filteredIds.map(id => new ObjectId(id)) } } }]).toArray()

    // For points, only keep userId if the point was created by the current user
    const filteredPoints = points.map(point => {
      const pointCopy = { ...point }
      if (pointCopy.userId !== synuser.synuser.id) {
        delete pointCopy.userId // Remove userId for points not created by the current user
      }
      return pointCopy
    })

    console.log('Filtered points:', filteredPoints)

    // Fetch why points where parentId is in the ids as string, and match by userId
    const whypoints = await Points.aggregate([
      {
        $match: {
          parentId: { $in: filteredIds.map(id => id.toString()) }, // Convert parentId to string version of ObjectId
          userId: synuser.synuser.id // Match only the why points created by the current user
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
