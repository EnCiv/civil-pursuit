// https://github.com/EnCiv/civil-pursuit/issues/136

const { Mongo, Collection } = require('@enciv/mongo-collections')

class Rankings extends Collection {
  static collectionName = 'rankings'

  static collectionOptions = {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Rankings Object Validation',
        required: ['parentId', 'userId'],
        properties: {
          parentId: {
            bsonType: 'string',
            description: "'parentId' must be a string and is required",
          },
          userId: {
            bsonType: 'string',
            description: "'userId' must be a string and is required",
          },
        },
      },
    },
  }

  static collectionIndexes = [
    { key: { parentId: 1 }, name: 'parentId_index' },
    { key: { userId: 1 }, name: 'userId_index' },
  ]
}

Rankings.setCollectionProps()

module.exports = Rankings
