// https://github.com/EnCiv/civil-pursuit/issues/196

const { Mongo, Collection } = require('@enciv/mongo-collections')
const Dturns = require('../dturns')
const { beforeEach } = require('@jest/globals')

const userId = '6667d5a33da5d19ddc304a6b'
const discussionId = '1111'

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
    // Create a new doc
    await Dturns.upsert(userId, discussionId, 0, { shownStatementIds: { 101: { most: 0 }, 111: { most: 0 } }, groupings: ['101', '111'] })
    const result = await Dturns.findOne()

    expect(result).toMatchObject({
      userId,
      discussionId,
      round: 0,
      shownStatementIds: { 101: { most: 0 }, 111: { most: 0 } },
      groupings: ['101', '111'],
    })

    // Try to update the doc
    const newData = {
      discussionId: '1111',
      userId: userId,
      round: 0,
      shownStatementIds: { 100: { most: 0 }, 101: { most: 1 }, 110: { most: 0 }, 111: { most: 1 } },
      groupings: ['100', '101', '110'],
    }

    await Dturns.upsert(newData.userId, newData.discussionId, newData.round, { shownStatementIds: newData.shownStatementIds, groupings: newData.groupings })

    const updateResult = await Dturns.findOne()
    expect(updateResult).toMatchObject(newData)
  })

  it('should retrieve all data when get function is called', async () => {
    const discussionId = '2024'

    for (let num = 0; num < 5; num++) {
      await Dturns.upsert(userId + num, discussionId, 0, { shownStatementIds: { [num]: { most: 0 } }, groupings: [] })
    }

    const result = await Dturns.getAllFromDiscussion(discussionId)

    expect(result).toMatchObject([
      {
        _id: /./,
        discussionId: discussionId,
        round: 0,
        userId: userId + '0',
        groupings: [],
        shownStatementIds: { 0: { most: 0 } },
      },
      {
        _id: /./,
        discussionId: discussionId,
        round: 0,
        userId: userId + '1',
        groupings: [],
        shownStatementIds: { 1: { most: 0 } },
      },
      {
        _id: /./,
        discussionId: discussionId,
        round: 0,
        userId: userId + '2',
        groupings: [],
        shownStatementIds: { 2: { most: 0 } },
      },
      {
        _id: /./,
        discussionId: discussionId,
        round: 0,
        userId: userId + '3',
        groupings: [],
        shownStatementIds: { 3: { most: 0 } },
      },
      {
        _id: /./,
        discussionId: discussionId,
        round: 0,
        userId: userId + '4',
        groupings: [],
        shownStatementIds: { 4: { most: 0 } },
      },
    ])
  })
})
