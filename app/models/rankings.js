// https://github.com/EnCiv/civil-pursuit/issues/136

const { Collection } = require('@enciv/mongo-collections')

class Rankings extends Collection {
  static collectionName = 'rankings'

  static collectionOptions = {}

  static collectionIndexes = [
    { key: { parentId: 1 }, name: 'parentId_index' },
    { key: { userId: 1 }, name: 'userId_index' },
  ]

  static validate(doc) {
    if (!doc.parentId || !doc.userId) {
      return { error: 'parentId and userId are required' }
    }
    return { result: doc }
  }
}

Rankings.setCollectionProps()

module.exports = Rankings
