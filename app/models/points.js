// https://github.com/EnCiv/civil-pursuit/issues/129

import { Collection } from '@enciv/mongo-collections'
import Joi from 'joi'
import JoiObjectID from 'joi-objectid'
import enforceRequiredFields from './lib/enforceRequiredFields'
import Validation from './lib/validation'

Joi.objectId = JoiObjectID(Joi)

class Points extends Collection {
  static collectionName = 'points' // name of the collection in MongoDB

  // Optional: Collection options objectt as defined in MongoDB createCollection
  static collectionOptions = {}

  // Optional: indexes array as defined in db.collection.createIndexes
  static collectionIndexes = [{ key: { subject: 1 }, name: 'subject_index', unique: true }]

  static joiSchema = Joi.object({
    _id: Validation.ObjectID(),
    subject: Validation.String(),
    description: Validation.String(),
    parentId: Validation.String(),
    category: Validation.String(),
    userId: Validation.String(),
  })

  static validate(doc, requiredFields) {
    const schema = requiredFields ? enforceRequiredFields(this.joiSchema, requiredFields) : this.joiSchema
    console.log(schema)
    const { error, value } = schema.validate(doc)
    if (error) {
      return { error: error.details[0].message }
    }
    return { result: value }
  }
}

Points.setCollectionProps() // initialize the collection with the properties

module.exports = Points
