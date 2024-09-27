// https://github.com/EnCiv/civil-pursuit/issues/136

const { Mongo, Collection } = require('@enciv/mongo-collections')
const Rankings = require('../rankings')

beforeAll(async () => {
  await Mongo.connect(global.__MONGO_URI__, { useUnifiedTopology: true })
  await Rankings.setCollectionProps()
})

beforeEach(async () => {
  await Rankings.drop()
  await Rankings.setCollectionProps()
  await Rankings.createIndexes([
    { key: { parentId: 1, userId: 1 }, name: 'unique_parentId_userId_index', unique: true },
  ])
})

afterAll(async () => {
  await Mongo.disconnect()
})

describe('Rankings Model', () => {
  it('should be set up correctly', () => {
    expect(Rankings.collectionName).toEqual('ranks')
  })

  it('should insert a valid document', async () => {
    const validDoc = {
      parentId: 'parent1',
      userId: 'user1',
      discussionId: 'discussion1',
      stage: 'pre',
      category: 'category1',
    }
    const result = await Rankings.insertOne(validDoc)
    expect(result.acknowledged).toBe(true)
  })

  it('should not insert an invalid document', async () => {
    const invalidDoc = {
      userId: 'user1',
    }
    await expect(Rankings.insertOne(invalidDoc)).rejects.toThrow('Document failed validation')
  })

  it('should enforce unique indexes', async () => {
    const doc1 = {
      parentId: 'parent2',
      userId: 'user2',
      discussionId: 'discussion2',
      stage: 'stage2',
      category: 'category2',
    }
    const doc2 = {
      parentId: 'parent2',
      userId: 'user2',
      discussionId: 'discussion2',
      stage: 'stage2',
      category: 'category2',
    }
    await Rankings.insertOne(doc1)
    await expect(Rankings.insertOne(doc2)).rejects.toThrow('duplicate key error')
  })

  it('should have the correct indexes', async () => {
    const indexes = await Rankings.indexes()
    expect(indexes).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'unique_parentId_userId_index' })]))
  })
})
