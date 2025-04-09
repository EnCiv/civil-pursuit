// https://github.com/EnCiv/civil-pursuit/issues/129

import { Collection } from '@enciv/mongo-collections'

class Points extends Collection {
  static collectionName = 'points' // name of the collection in MongoDB

  // Optional: Collection options objectt as defined in MongoDB createCollection
  static collectionOptions = {}

  // Optional: Validation function
  static validate(doc) {
    if (typeof doc.subject !== 'string' || typeof doc.description !== 'string') {
      return { error: 'subject and description are required strings' }
    }
    return { result: doc }
  }
}

Points.setCollectionProps() // initialize the collection with the properties

module.exports = Points
