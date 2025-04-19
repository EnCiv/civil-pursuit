// https://github.com/EnCiv/civil-pursuit/issues/304
import { Collection } from '@enciv/mongo-collections'

class Jsforms extends Collection {
  static collectionName = 'jsforms'

  static collectionOptions = {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Jsform Object Validation',
        required: ['_id', 'parentId'],
        properties: {
          _id: {
            description: "'_id' must be an ObjectId and is required",
          },
          parentId: {
            description: "'parentId' must be an ObjectId and is required",
          },
          userId: {
            description: "'userId' must be an ObjectId",
          },
        },
        additionalProperties: { type: 'object' },
      },
    },
  }
}

Jsforms.setCollectionProps()

module.exports = Jsforms
