const { Mongo, Collection } = require('@enciv/mongo-collections')

class InviteLog extends Collection {
  static collectionName = 'invite_logs'

  static collectionOptions = {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        title: 'InviteLog Validation',
        required: ['userId', 'discussionId', 'sentAt'],
        additionalProperties: true,
        properties: {
          userId: { bsonType: 'string', description: "'userId' must be a string and is required" },
          discussionId: { bsonType: 'string', description: "'discussionId' must be a string and is required" },
          round: { bsonType: 'number', description: "'round' should be a number" },
          sentAt: { bsonType: 'date', description: "'sentAt' must be a date and is required" },
        },
      },
    },
  }

  static collectionIndexes = [
    { key: { userId: 1 }, name: 'userId_index' },
    { key: { discussionId: 1 }, name: 'discussionId_index' },
    { key: { sentAt: -1 }, name: 'sentAt_index' },
  ]

  static countInvitesForUser = async function ({ userId, discussionId, round, since }) {
    const q = { userId }
    if (discussionId) q.discussionId = discussionId
    if (typeof round === 'number') q.round = round
    if (since) q.sentAt = { $gte: since }
    return InviteLog.countDocuments(q)
  }

  static findLastInvite = async function ({ userId, discussionId, round }) {
    const q = { userId }
    if (discussionId) q.discussionId = discussionId
    if (typeof round === 'number') q.round = round
    const arr = await InviteLog.find(q).sort({ sentAt: -1 }).limit(1).toArray()
    return arr[0]
  }
}

InviteLog.setCollectionProps() // initialize collection after mongo is connected
module.exports = InviteLog
