// https://github.com/EnCiv/civil-pursuit/issues/129

import { Collection } from '@enciv/mongo-collections';
import Joi from 'joi';
import JoiObjectID from 'joi-objectid';
import enforceRequiredFields from './lib/enforceRequiredFields';

Joi.objectId = JoiObjectID(Joi)

const SANE = 4096;
const Integer = /^[0-9]+$/
const ObjectID = /^[0-9a-fA-F]{24}$/

const String = () => Joi.string().allow('').max(SANE);
const IsoDate = () => Joi.string().allow('').isoDate();
const Email = () => Joi.string().allow('').email();
const Number = () => Joi.number()

const pointSchema = Joi.object({
  _id: Joi.objectId(),
  title: String(),
  description: String(),
  parentId: Number(),
  category: String(),
  round: Number(),
  userId: String()
  })

class Points extends Collection {
  static collectionName = 'points' // name of the collection in MongoDB

  // Optional: Collection options objectt as defined in MongoDB createCollection
  static collectionOptions = {}

  // Optional: indexes array as defined in db.collection.createIndexes
  static collectionIndexes = [{ key: { title: 1 }, name: 'title_index', unique: true }]

  static validateRequiredFields(requiredFields, doc) {
    const schema = enforceRequiredFields(pointSchema, requiredFields)
    const {error, value} = schema.validate(doc)
    if (error) {
      return { error: error.details[0].message}
    }
    return {result: value}


  }

  // Optional: Validation function
  // static validate(doc) {

  //   const { error, value } = pointSchema.validate(doc)
  //   if (error) {
  //     return { error: error.details[0].message}
  //   }
  //   return { result: value}

  // }


}

Points.setCollectionProps() // initialize the collection with the properties

module.exports = { Points, pointSchema}
