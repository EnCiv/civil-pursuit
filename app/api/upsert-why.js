// https://github.com/EnCiv/civil-pursuit/issues/133

const Joi = require('joi')
const { Points, pointSchema } = require('../models/points')

function enforceRequiredFields(schema, requiredFields) { // Add required fields to schema through Joi
  const schemaDescription = schema.describe()
  const newSchema = {}

  Object.keys(schemaDescription.keys).forEach((key) => {
    newSchema[key] = requiredFields.includes(key) ? schema.extract(key).required() : schema.extract(key)
  })

  return Joi.object(newSchema)

}

async function upsertWhy(pointObj, cb) {
  if (!this.synuser || !this.synuser.id) {
    console.error('upsertWhy called but no user logged in')
    return cb && cb(null) // No user logged in
  }

  const userId = this.synuser.id
  pointObj.userId = userId // Add userId to the document

  const requiredFields = ['_id', 'title', 'description', 'userId']
  const schema = enforceRequiredFields(pointSchema, requiredFields)
  const validation = schema.validate(pointObj) // Validate pointObj

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
