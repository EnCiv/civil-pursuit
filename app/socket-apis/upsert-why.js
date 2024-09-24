// https://github.com/EnCiv/civil-pursuit/issues/133

const Joi = require('joi')
const { Points, pointSchema } = require('../models/points')
const { ObjectId } = require('mongodb')

async function upsertWhy(pointObj, cb) {
  if (!this.synuser || !this.synuser.id) {
    console.error('upsertWhy called but no user logged in')
    return cb && cb(null) // No user logged in
  }

  const userId = this.synuser.id
  pointObj.userId = userId // Add userId to the document

  const requiredFields = ['_id', 'title', 'description', 'userId']

  const validation = Points.validateRequiredFields(requiredFields, pointObj) // Validate pointObj

  pointObj._id = new ObjectId(pointObj._id) // Convert _id to an ObjectId object for mongo


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
