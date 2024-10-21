// https://github.com/EnCiv/civil-pursuit/issues/206

const Points = require('../models/points')
async function getUserWhys(ids, cb) {
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    if (cb) cb(undefined)
  }

  // Check if user is logged in
  if (!this.synuser || !this.synuser.id) {
    return cbFailure('Cannot retrieve whys - user is not logged in.')
  }

  // Verify that ids is provided and is a valid array
  if (!Array.isArray(ids) || ids.length === 0) {
    return cbFailure('Invalid argument provided to getUserWhys(ids: Array, cb: Function).')
  }

  // Fetch points from the Points collection where parentId matches any of the ids
  const pointsList = await Points.find({ parentId: { $in: ids }, userId: this.synuser.id })
    .toArray()
    .catch(error => {
      return cbFailure(`Failed to retrieve points - Points.find failed: ${error.message}`)
    })
  // If pointsList is undefined, it means the catch block was triggered due to an error in the database query.
  // In this case, we return early to avoid executing further logic.
  if (!pointsList) {
    return
  }

  // Return the points list
  if (cb) cb(pointsList)
  return
}

module.exports = getUserWhys
