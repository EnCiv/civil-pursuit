//https://github.com/EnCiv/civil-pursuit/issues/134

const Ranks = require('../models/ranks')

async function validateRankObj(rankObj) {
  // Basic validation to check required fields
  if (!rankObj.parentId || !rankObj.round || !rankObj.rank || !rankObj.discussionId || !rankObj.stage) {
    console.log('Validation result: not valid')
    return false
  }

  console.log('Validation result: valid')
  return true
}

async function rankWhy(rankObj, cb) {
  if (!this.synuser || !this.synuser.id) {
    console.error('rankWhy called but no user logged in')
    return cb && cb(undefined) // No user logged in
  }
  const userId = this.synuser.id
  rankObj.userId = userId // Add userId to the document

  const isValid = await validateRankObj(rankObj)
  if (!isValid) {
    return cb && cb(undefined)
  }

  try {
    await Ranks.updateOne({ _id: rankObj._id }, { $set: rankObj }, { upsert: true })
    const updatedDoc = await Ranks.findOne({ _id: rankObj._id })
    if (updatedDoc) {
      // Remove userId before returning the document
      const { userId, ...result } = updatedDoc.toObject()
      cb(result)
    } else {
      cb(undefined) // Return undefined if the document wasn't found
    }
  } catch (error) {
    console.error(error)
    cb(undefined) // Return null indicating an error
  }
}

module.exports = rankWhy
