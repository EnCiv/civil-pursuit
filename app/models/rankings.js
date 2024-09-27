// https://github.com/EnCiv/civil-pursuit/issues/136
// https://github.com/EnCiv/civil-pursuit/issues/205

const { Mongo, Collection } = require('@enciv/mongo-collections')

class Rankings extends Collection {
  static collectionName = 'ranks'

  static collectionOptions = {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Rankings Object Validation',
        required: ['parentId', 'stage', 'discussionId', 'category', 'userId'],
        properties: {
          parentId: {
            bsonType: 'string',
            description: "'parentId' must be a string and is required",
          },
          stage: {
            bsonType: 'string',
            description: "'stage' must be a string and is required",
          },
          discussionId: {
            bsonType: 'string',
            description: "'discussionId' must be a string and is required",
          },
          category: {
            bsonType: 'string',
            description: "'category' must be a string and is required",
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
