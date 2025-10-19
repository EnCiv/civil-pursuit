// https://github.com/EnCiv/civil-pursuit/issues/129
// https://github.com/EnCiv/civil-pursuit/issues/149

import { Collection } from '@enciv/mongo-collections'
import Joi from 'joi'

class Points extends Collection {
  static collectionName = 'points' // name of the collection in MongoDB

  // Optional: Collection options objectt as defined in MongoDB createCollection
  static collectionOptions = {}

  // Optional: Validation function
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

  static Joi = Joi.object({
    _id: Joi.string(),
    title: Joi.string(),
    description: Joi.string(),
    parentId: Joi.string(),
    category: Joi.string(),
    round: Joi.number(),
    userId: Joi.string(),
  })
}

Points.setCollectionProps() // initialize the collection with the properties

module.exports = Points
