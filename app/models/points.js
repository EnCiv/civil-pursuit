// https://github.com/EnCiv/civil-pursuit/issues/129

import { Collection } from '@enciv/mongo-collections'
import Joi from 'joi'
import JoiObjectID from 'joi-objectid'
import enforceRequiredFields from './lib/enforceRequiredFields'

Joi.objectId = JoiObjectID(Joi)

const SANE = 4096
const Integer = /^[0-9]+$/
const ObjectID = /^[0-9a-fA-F]{24}$/

const String = () => Joi.string().allow('').max(SANE)
const IsoDate = () => Joi.string().allow('').isoDate()
const Email = () => Joi.string().allow('').email()
const Number = () => Joi.number()

const pointSchema = Joi.object({
  _id: String(),
  title: String(),
  description: String(),
  parentId: String(),
  category: String(),
  round: Number(),
  userId: String(),
})

class Points extends Collection {
  static collectionName = 'points' // name of the collection in MongoDB

  // Optional: Collection options objectt as defined in MongoDB createCollection
  static collectionOptions = {}

  // Optional: Validation function
  static validate(doc) {
    if (typeof doc.subject !== 'string' || typeof doc.description !== 'string') {
      return { error: 'subject and description are required strings' }
    }
    return { result: value }
  }
}

Points.setCollectionProps() // initialize the collection with the properties

module.exports = { Points, pointSchema }
