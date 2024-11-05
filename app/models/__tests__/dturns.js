// https://github.com/EnCiv/civil-pursuit/issues/196

const { Mongo, Collection } = require('@enciv/mongo-collections')
const Dturns = require('../dturns')
const { beforeEach } = require('@jest/globals')

const userId = '6667d5a33da5d19ddc304a6b'

beforeEach(async () => {
  await Dturns.deleteMany({})
})

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
      discussionId: '2024',
      userId: userId,
      round: 0,
      data: { user: '11111', points: { point1: 'point1', point2: 'point2' } },
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
      userId: userId,
      discussionId: '1111',
      round: 0,
      shownStatementIds: { points: ['101', '111'] },
      groupings: [],
    }
    // Create a new doc
    await Dturns.upsert(doc.userId, doc.discussionId, doc.round, doc.shownStatementIds, doc.groupings)
    const result = await Dturns.findOne()

    expect(result).toMatchObject(doc)

    // Try to update the doc
    const newData = {
      discussionId: '1111',
      userId: userId,
      round: 0,
      shownStatementIds: { points: ['100', '101', '110', '111'] },
      groupings: [],
    }

    await Dturns.upsert(
      newData.userId,
      newData.discussionId,
      newData.round,
      newData.shownStatementIds,
      newData.groupings
    )

    const updateResult = await Dturns.findOne()
    expect(updateResult).toMatchObject(newData)
  })

  it('should retrieve all data when get function is called', async () => {
    const discussionId = '2024'

    for (let num = 0; num < 5; num++) {
      await Dturns.upsert(userId + num, discussionId, 0, { points: [num] }, [])
    }

    const result = await Dturns.getAllFromDiscussion(discussionId)

    expect(await result.toArray()).toMatchObject([
      {
        _id: /./,
        discussionId: discussionId,
        round: 0,
        userId: userId + '0',
        groupings: [],
        shownStatementIds: { points: [0] },
      },
      {
        _id: /./,
        discussionId: discussionId,
        round: 0,
        userId: userId + '1',
        groupings: [],
        shownStatementIds: { points: [1] },
      },
      {
        _id: /./,
        discussionId: discussionId,
        round: 0,
        userId: userId + '2',
        groupings: [],
        shownStatementIds: { points: [2] },
      },
      {
        _id: /./,
        discussionId: discussionId,
        round: 0,
        userId: userId + '3',
        groupings: [],
        shownStatementIds: { points: [3] },
      },
      {
        _id: /./,
        discussionId: discussionId,
        round: 0,
        userId: userId + '4',
        groupings: [],
        shownStatementIds: { points: [4] },
      },
    ])
  })
})
