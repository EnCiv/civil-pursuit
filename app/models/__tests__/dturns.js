// https://github.com/EnCiv/civil-pursuit/issues/196

const { Mongo, Collection } = require('@enciv/mongo-collections')
const Dturns = require('../dturns')

const userId = '6667d5a33da5d19ddc304a6b'

beforeAll(async () => {
  await Mongo.connect(global.__MONGO_URI__, { useUnifiedTopology: true })
  await Dturns.setCollectionProps()
})

afterAll(async () => {
  await Mongo.disconnect()
})

describe('Dturns Model', () => {
  it('should be set up correctly', () => {
    expect(Dturns.collectionName).toEqual('dturns')
  })

  it('should insert a valid document', async () => {
    const validDoc = {
      discussionId: 'discussionId',
      userId: userId,
      round: 0,
      data: { user: 'userId', points: { point1: 'point1', point2: 'point2' } },
    }
    const result = await Dturns.insertOne(validDoc)
    expect(result.acknowledged).toBe(true)
  })

  it('should not insert an invalid document', async () => {
    const invalidDoc = {
      data: 'not real data',
    }
    await expect(Dturns.insertOne(invalidDoc)).rejects.toThrow('Document failed validation')
  })

  it('should upsert when the upsert function is called', async () => {
    const doc = {
      discussionId: '1',
      userId: userId,
      round: 0,
      shownStatementIds: { points: ['id1', 'id2'] },
      groupings: {},
    }
    // Create a new doc
    const result = await Dturns.upsert(userId, doc.discussionId, 0, {}, {})
    expect(result).toMatchObject(doc)

    // Try to update the doc
    const newData = {
      discussionId: '1',
      userId: userId,
      round: 0,
      shownStatementIds: { points: ['id1', 'id2', 'id3', 'id4'] },
      groupings: {},
    }
    const updateResult = await Dturns.upsert(...newData)

    expect(updateResult).toMatchObject(newData)
  })

  it('should retrieve all data when get function is called', async () => {
    const discussionId = 'discussion'

    for (let num = 0; num < 5; num++) {
      await Dturns.upsert(userId + num, discussionId, 0, { field1: `data ${num}` })
    }

    const result = await Dturns.getAllFromDiscussion(discussionId)
    expect(await result.toArray()).toMatchObject([
      {
        _id: /./,
        data: { field1: 'data 0' },
        discussionId: 'discussion',
      },
      {
        _id: /./,
        data: { field1: 'data 1' },
        discussionId: 'discussion',
      },
      {
        _id: /./,
        data: { field1: 'data 2' },
        discussionId: 'discussion',
      },
      {
        _id: /./,
        data: { field1: 'data 3' },
        discussionId: 'discussion',
      },
      {
        _id: /./,
        data: { field1: 'data 4' },
        discussionId: 'discussion',
      },
    ])
  })
})
