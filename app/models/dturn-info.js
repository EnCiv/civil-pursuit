// https://github.com/EnCiv/civil-pursuit/issues/196

import { Collection } from '@enciv/mongo-collections'

class DturnInfo extends Collection {
  static collectionName = 'dturnInfo'

  static collectionOptions = {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'DturnInfo Object Validation',
        required: ['discussionId', 'data'],
        properties: {
          discussionId: {
            bsonType: 'string',
            description: "'discussionId' must be an ObjectId and is required",
          },
          data: {
            bsonType: 'object',
            description: "'data' must be an object and is required",
          },
        },
      },
    },
  }
}

DturnInfo.setCollectionProps()

module.exports = DturnInfo
