// https://github.com/EnCiv/civil-pursuit/issues/196

import { Collection } from '@enciv/mongo-collections'

class Dturns extends Collection {
  static collectionName = 'dturns'

  static collectionOptions = {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Dturn Object Validation',
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
          shownStatementIds: {
            bsonType: 'object',
            description: "'shownStatementIds' must be an object and is required",
          },
          groupings: {
            bsonType: 'object',
            description: "'groupings' must be an array and is required",
          },
        },
      },
    },
  }

  static async getAllFromDiscussion(discussionId) {
    return await this.find({ discussionId: discussionId })
  }

  static async upsert(userId, discussionId, round, shownStatementIds, groupings) {
    const dturnObj = {
      discussionId: discussionId,
      round: round,
      userId: userId,
      shownStatementIds: shownStatementIds,
      groupings: groupings,
    }
    await this.updateOne(
      { discussionId: discussionId, round: round, userId: userId },
      { $set: dturnObj },
      { upsert: true }
    )
  }
}

Dturns.setCollectionProps()

module.exports = Dturns
