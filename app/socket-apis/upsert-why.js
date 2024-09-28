// https://github.com/EnCiv/civil-pursuit/issues/133

const Joi = require('joi')
const Points = require('../models/points')

const schema= Joi.object({
  category: Joi.string().valid('most', 'least', 'neutral').required(),
})

async function upsertWhy(pointObj, cb) {
  if (!this.synuser || !this.synuser.id) {
    console.error('upsertWhy called but no user logged in')
    return cb && cb(null) // No user logged in
  }
  const userId = this.synuser.id
  pointObj.userId = userId // Add userId to the document

  // Joi validation for the category
  try {
    await schema.validateAsync({category: pointObj.category});
    console.log(`Category validation successful for: ${pointObj.category}`);
  } catch (error) {
    console.error('Validation error in upsertWhy:', error['details'][0]['message']);
    return cb && cb(null); // Return validation error
  }

  const validation = Points.validate(pointObj)
  if (validation.error) {
    console.error(validation.error)
    return cb && cb(null) // Return validation error
  }

  try {
    await Points.updateOne({ _id: pointObj._id }, { $set: pointObj }, { upsert: true });
    const updatedDoc = await Points.findOne({ _id: pointObj._id });
    cb(updatedDoc);
  } catch (error) {
    console.error(error);
    cb(null); // Return null indicating an error
  }
}

module.exports = upsertWhy
