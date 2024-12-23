import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ObjectId } from 'mongodb'
import upsertRank from '../upsert-rank'
import Ranks from '../../models/ranks'

const USER1 = '6667d5a33da5d19ddc304a6b'
const RANK1 = new ObjectId('6667d688b20d8e339ca50020')
const RANK2 = new ObjectId('6667e4eea414d31b20dffb2f')
const discussion1 = '674e15d08074148b508f8a45'
let MemoryServer

beforeAll(async () => {
  MemoryServer = await MongoMemoryServer.create()
  const uri = MemoryServer.getUri()
  await Mongo.connect(uri)
})

beforeEach(async () => {
  const collections = await Mongo.db.collections()
  // Clear all collections
  for (let collection of collections) {
    await collection.deleteMany({})
  }

  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(async () => {
  console.error.mockRestore()
})

afterAll(async () => {
  await Mongo.disconnect()
  await MemoryServer.stop()
})

test('Insert a new rank document', async () => {
  const rankObj = {
    _id: RANK2.toString(),
    parentId: 'parent-id-1',
    round: 1,
    stage: 'pre',
    category: 'most',
    discussionId: discussion1,
  }

  const cb = jest.fn()

  await upsertRank.call({ synuser: { id: USER1 } }, rankObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)

  const rank = await Ranks.findOne({ parentId: 'parent-id-1', userId: USER1 })
  expect(rank).toEqual({ ...rankObj, userId: USER1 })
})

test('Update an existing rank document with a different category', async () => {
  const initialRankObj = {
    _id: RANK1.toString(),
    parentId: 'parent-id-1',
    round: 1,
    stage: 'pre',
    category: 'least', // different initial category
    discussionId: discussion1,
  }

  const cb = jest.fn()
  await upsertRank.call({ synuser: { id: USER1 } }, initialRankObj, cb)

  // const inserted = await Mongo.db.collection('ranks').findOne({ _id: RANK1 }) // make sure the insertion is sucessful
  // console.log('Inserted document:', inserted)

  const rankObj = {
    _id: RANK1.toString(),
    parentId: 'parent-id-1',
    round: 1,
    stage: 'pre',
    category: 'most',
    discussionId: discussion1,
  }

  await upsertRank.call({ synuser: { id: USER1 } }, rankObj, cb)

  expect(cb).toHaveBeenCalledTimes(2)
  const rank = await Ranks.findOne({ _id: RANK1, userId: USER1 })
  // console.log('Updated document:', rank) // check the doc is updated
  expect(rank).toMatchObject({ ...rankObj, userId: USER1 })
})

test('Fail if the user is not logged in', async () => {
  const rankObj = { parentId: 'parent-id-2', round: 1, stage: 'pre', category: 'most', discussionId: 'discussion-2' }
  const cb = jest.fn()

  await upsertRank.call({}, rankObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const rank = await Ranks.findOne({ parentId: 'parent-id-2' })
  expect(rank).toBeNull()
})

test('Fail if one of the required parameters is missing', async () => {
  const invalidRankObj = { round: 1, category: 'most', stage: 'pre' } // Missing parentId and discussionId
  const user = { id: USER1 }

  const cb = jest.fn()

  await upsertRank.call({ synuser: user }, invalidRankObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith()

  const rank = await Ranks.findOne({ round: 1, category: 'most' })
  expect(rank).toBeNull()
})
