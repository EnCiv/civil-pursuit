// https://github.com/EnCiv/civil-pursuit/issues/129

import { Collection } from '@enciv/mongo-collections'
import Joi from 'joi'
import JoiObjectID from 'joi-objectid'
import enforceRequiredFields from './lib/enforceRequiredFields'

Joi.objectId = JoiObjectID(Joi)

class Points extends Collection {
  static collectionName = 'points' // name of the collection in MongoDB

  // Optional: Collection options objectt as defined in MongoDB createCollection
  static collectionOptions = {}

  // Optional: indexes array as defined in db.collection.createIndexes
  static collectionIndexes = [{ key: { title: 1 }, name: 'title_index', unique: true }]

  static SANE = 4096
  static Integer = /^[0-9]+$/
  static ObjectID = /^[0-9a-fA-F]{24}$/

  static String = () => Joi.string().allow('').max(SANE)
  static IsoDate = () => Joi.string().allow('').isoDate()
  static Email = () => Joi.string().allow('').email()
  static Number = () => Joi.number()

  static Joi = Joi.object({
    _id: String(),
    title: String(),
    description: String(),
    parentId: String(),
    category: String(),
    round: Number(),
    userId: String(),
  })

  static validate(doc) {
    const schema = Joi.object({
      subject: Joi.string().required(),
      description: Joi.string().required(),
    }).options({ allowUnknown: true })

    const { error, value } = schema.validate(doc, { abortEarly: false })

    if (error) {
      return { error: 'subject and description are required strings' }
    }

    return { result: value }
  }

  static validateRequiredFields(requiredFields, doc) {
    const schema = enforceRequiredFields(pointSchema, requiredFields)
    const { error, value } = schema.validate(doc)
    if (error) {
      return { error: error.details[0].message }
    }
    return { result: value }
  }
}

Points.setCollectionProps() // initialize the collection with the properties

module.exports = { Points }
