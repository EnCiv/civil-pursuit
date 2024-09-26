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

  static async getAllFromDiscussion(discussionId) {
    return await this.find({ discussionId: discussionId })
  }

  static async upsert(discussionId, data) {
    const dturnInfoObj = { discussionId: discussionId, data: data }
    await this.updateOne({ discussionId: discussionId, data: data }, { $set: dturnInfoObj }, { upsert: true })
    return await this.findOne({ discussionId: discussionId })
  }
}

DturnInfo.setCollectionProps()

module.exports = DturnInfo
