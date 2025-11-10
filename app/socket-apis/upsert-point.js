// https://github.com/EnCiv/civil-pursuit/issues/129

import Points from '../models/points'

export default async function upsertPoint(pointObj, cb) {
  if (!this.synuser || !this.synuser.id) {
    console.error('upsertPoint called but no user logged in')
    return cb && cb() // No user logged in
  }

  const userId = this.synuser.id
  pointObj.userId = userId // Add userId to the document
  const validation = Points.validate(pointObj, ['subject', 'description', '_id', 'userId'])

  if (validation.error) {
    console.error(validation.error)
    return cb && cb() // Return validation error
  }

  const correctedPointObj = { ...pointObj, _id: new Points.ObjectId(pointObj._id) }

  try {
    await Points.updateOne({ _id: correctedPointObj._id }, { $set: correctedPointObj }, { upsert: true })
    if (!cb) return
    const updatedDoc = await Points.findOne({ _id: correctedPointObj._id })
    updatedDoc._id = updatedDoc._id.toString() // Convert ObjectId to string
    cb(updatedDoc)
  } catch (error) {
    console.error(error)
    cb()
  }
}
