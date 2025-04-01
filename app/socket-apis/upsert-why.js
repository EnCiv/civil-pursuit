// https://github.com/EnCiv/civil-pursuit/issues/133
// https://github.com/EnCiv/civil-pursuit/issues/210

import Joi from 'joi'
import Points from '../models/points'

const schema = Joi.object({
  category: Joi.string().valid('most', 'least', 'neutral').required(),
})

export default async function upsertWhy(pointObj, cb) {
  if (!this.synuser || !this.synuser.id) {
    console.error('upsertWhy called but no user logged in')
    return cb?.(undefined) // No user logged in
  }
  const userId = this.synuser.id
  pointObj.userId = userId // Add userId to the document

  // Joi validation for the category
  const { error } = schema.validate({ category: pointObj.category })
  if (error) {
    console.error('Validation error in upsertWhy:', error.details[0].message)
    return cb?.(undefined) // Return validation error
  }

  const validation = Points.validate(pointObj)
  if (validation.error) {
    console.error(validation.error)
    return cb?.(undefined) // Return validation error
  }

  try {
    await Points.updateOne({ _id: pointObj._id }, { $set: pointObj }, { upsert: true })
    const updatedDoc = await Points.findOne({ _id: pointObj._id })
    cb?.(updatedDoc)
  } catch (error) {
    console.error(error)
    cb?.(undefined) // Return undefined indicating an error
  }
}
