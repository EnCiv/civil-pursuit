//https://github.com/EnCiv/civil-pursuit/issues/211

const Joi = require('joi')
const Ranks = require('../models/ranks')

// Define the validation schema using Joi
const rankSchema = Joi.object({
  _id: Joi.string().optional(), // _id is optional when creating a new document
  stage: Joi.string().valid('pre', 'post', 'why').required(), // stage must be one of 'pre', 'post', 'why'
  category: Joi.string().valid('most', 'least', 'neutral').required(), // category must be one of 'most', 'least', 'neutral'
  parentId: Joi.string().required(), // parentId is required
  userId: Joi.string().optional(), // userId is optional and will be deleted later if needed
  discussionId: Joi.string().required(), // discussionId is required
  round: Joi.number().integer().min(1).required(), // round must be an integer >= 1
})

async function upsertRank(rankObj, cb) {
  if (!this.synuser || !this.synuser.id) {
    console.error('upsertRank called but no user logged in')
    return cb && cb(undefined) // No user logged in
  }
  const userId = this.synuser.id
  rankObj.userId = userId // Add userId to the document

  // Direct validation
  const { error } = rankSchema.validate(rankObj)
  if (error) {
    console.error('Validation error in upsertRank:', error.details[0].message)
    return cb && cb(null) // Return null to indicate validation error
  }

  try {
    await Ranks.updateOne({ _id: rankObj._id }, { $set: rankObj }, { upsert: true })
    const updatedDoc = await Ranks.findOne({ _id: rankObj._id })
    if (updatedDoc) {
      // Remove userId before returning the document if the request is not from the user themselves
      let result = updatedDoc
      if (result.userId !== userId) {
        delete result.userId
      }
      cb(result)
    } else {
      cb(undefined) // Return undefined if the document wasn't found
    }
  } catch (error) {
    console.error(error)
    cb(undefined) // Return undefined indicating an error
  }
}

module.exports = upsertRank
