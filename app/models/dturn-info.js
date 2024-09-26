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
          userId: {
            bsonType: 'string',
            description: "'userId' must be an ObjectId",
          },
          round: {
            bsonType: 'number',
            description: "'round' must be a number",
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

  static async upsert(userId, discussionId, round, data) {
    const dturnInfoObj = { discussionId: discussionId, round: round, userId: userId, data: data }
    await this.updateOne(
      { discussionId: discussionId, round: round, userId: userId },
      { $set: dturnInfoObj },
      { upsert: true }
    )
    return await this.findOne({ discussionId: discussionId })
  }
}

DturnInfo.setCollectionProps()

module.exports = DturnInfo
