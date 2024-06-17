// https://github.com/EnCiv/civil-pursuit/issues/129

import { Collection } from '@enciv/mongo-collections'

class Points extends Collection {
  static collectionName = 'points' // name of the collection in MongoDB

  // Optional: Collection options objectt as defined in MongoDB createCollection
  static collectionOptions = {}

  // Optional: indexes array as defined in db.collection.createIndexes
  static collectionIndexes = [{ key: { title: 1 }, name: 'title_index', unique: true }]

  // Optional: Validation function
  static validate(doc) {
    if (!doc.title || !doc.description) {
      return { error: 'Title and description are required' }
    }
    return { result: doc }
  }
}

Points.setCollectionProps() // initialize the collection with the properties

module.exports = Points
