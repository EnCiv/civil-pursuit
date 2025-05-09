// https://github.com/EnCiv/civil-pursuit/issues/196

import { Collection } from '@enciv/mongo-collections'
import docToSetUnset from '../lib/doc-to-set-unset'

class Dturns extends Collection {
  static collectionName = 'dturns'

  static collectionOptions = {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'Dturn Object Validation',
        required: ['discussionId', 'userId'],
        properties: {
          discussionId: {
            description: "'discussionId' must be an ObjectId and is required",
          },
          userId: {
            description: "'userId' must be an ObjectId",
          },
          round: {
            description: "'round' must be a number",
          },
          shownStatementIds: {
            description: "'shownStatementIds' must be an object",
          },
          groupings: {
            description: "'groupings' must be an array",
          },
        },
      },
    },
  }

  static async getAllFromDiscussion(discussionId) {
    return await this.find({ discussionId: discussionId }).toArray()
  }

  // upsert's are deltas, the changes that should be made to the doc, for example shownStatementIds is a table, and new statements can be added to the table without overwriting the old ones
  static async upsert(userId, discussionId, round, info) {
    const dturnObj = {
      discussionId,
      round,
      userId,
      ...info,
    }
    const [$set, $unset] = docToSetUnset(dturnObj)

    await this.updateOne({ discussionId, userId, round }, { $set, $unset }, { upsert: true })
  }
}

Dturns.setCollectionProps()

module.exports = Dturns
