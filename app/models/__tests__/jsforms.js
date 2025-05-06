// https://github.com/EnCiv/civil-pursuit/issues/304

const { Mongo, Collection } = require('@enciv/mongo-collections')
const Jsforms = require('../jsforms')
const { beforeEach } = require('@jest/globals')

const discussionId = '111'
const userId = '6667d5a33da5d19ddc304a6b'

beforeEach(async () => {
  await Jsforms.deleteMany({})
})

beforeAll(async () => {
  await Mongo.connect(global.__MONGO_URI__, { useUnifiedTopology: true })
  await Jsforms.setCollectionProps()
})

afterAll(async () => {
  await Mongo.disconnect()
})

describe('Jsforms Model', () => {
  it('should be set up correctly', () => {
    expect(Jsforms.collectionName).toEqual('jsforms')
  })

  it('should insert a valid document', async () => {
    const validDoc = {
      _id: '101',
      parentId: discussionId,
      userId: userId,
      moreDetails: {
        objectExample: {
          fieldOne: 'dfgsdfg',
          fieldTwo: 'sdfgdsdfg',
          fieldThree: '13123123',
          fieldFour: '34tw456w456',
        },
        stringExample: 'sfdsdfg',
      },
    }
    const result = await Jsforms.insertOne(validDoc)
    expect(result.acknowledged).toBe(true)
  })

  it('should not insert an invalid document', async () => {
    const invalidDoc = {
      _id: '101',
      parentId: '110',
      userId: userId,
      moreDetails: 'no',
    }
    await expect(Jsforms.insertOne(invalidDoc)).rejects.toThrow('Document failed validation')
  })
})
