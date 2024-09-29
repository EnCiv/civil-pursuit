// https://github.com/EnCiv/civil-pursuit/issues/196

const { Mongo, Collection } = require('@enciv/mongo-collections')
const DturnInfo = require('../dturn-info')

const userId = '6667d5a33da5d19ddc304a6b'

beforeAll(async () => {
  await Mongo.connect(global.__MONGO_URI__, { useUnifiedTopology: true })
  await DturnInfo.setCollectionProps()
})

afterAll(async () => {
  await Mongo.disconnect()
})

describe('DturnInfo Model', () => {
  it('should be set up correctly', () => {
    expect(DturnInfo.collectionName).toEqual('dturnInfo')
  })

  it('should insert a valid document', async () => {
    const validDoc = {
      discussionId: 'discussionId',
      userId: userId,
      round: 0,
      data: { user: 'userId', points: { point1: 'point1', point2: 'point2' } },
    }
    const result = await DturnInfo.insertOne(validDoc)
    expect(result.acknowledged).toBe(true)
  })

  it('should not insert an invalid document', async () => {
    const invalidDoc = {
      data: 'not real data',
    }
    await expect(DturnInfo.insertOne(invalidDoc)).rejects.toThrow('Document failed validation')
  })

  it('should upsert when the upsert function is called', async () => {
    const doc = {
      discussionId: '1',
      userId: userId,
      round: 0,
      data: { field1: 'this is data', field2: 'and this is too' },
    }
    // Create a new doc
    const result = await DturnInfo.upsert(userId, doc.discussionId, 0, doc.data)
    expect(result).toMatchObject(doc)

    // Try to update the doc
    const newData = { ...doc.data, field3: 'new field!' }
    const updateResult = await DturnInfo.upsert(userId, doc.discussionId, 0, newData)
    expect(updateResult).toMatchObject({ ...doc, data: newData })
  })

  it('should retrieve all data when get function is called', async () => {
    const discussionId = 'discussion'

    for (let num = 0; num < 5; num++) {
      await DturnInfo.upsert(userId + num, discussionId, 0, { field1: `data ${num}` })
    }

    const result = await DturnInfo.getAllFromDiscussion(discussionId)
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
