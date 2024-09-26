// https://github.com/EnCiv/civil-pursuit/issues/196

const { Mongo, Collection } = require('@enciv/mongo-collections')
const DturnInfo = require('../dturn-info')

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
})
