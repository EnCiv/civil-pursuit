import rankWhy from '../rank-why'
import Ranks from '../../models/ranks'
import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ObjectId } from 'mongodb'

const USER1 = '6667d5a33da5d19ddc304a6b'
const RANK1 = new ObjectId('6667d688b20d8e339ca50020')
const RANK2 = new ObjectId('6667e4eea414d31b20dffb2f')
let MemoryServer

beforeAll(async () => {
  MemoryServer = await MongoMemoryServer.create()
  const uri = MemoryServer.getUri()
  await Mongo.connect(uri)
})

beforeEach(async () => {
  // Clear the collection
  await Ranks.deleteMany({})
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
    _id: RANK2,
    parentId: 'parent-id-1',
    round: 1,
    rank: 'most',
    stage: 'pre',
    category: 'category-1',
    discussionId: 'discussion-1',
  }

  const cb = jest.fn()

  await rankWhy.call({ synuser: { id: USER1 } }, rankObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)

  const rank = await Ranks.findOne({ parentId: 'parent-id-1', userId: USER1 })
  expect(rank).toEqual({ ...rankObj, userId: USER1 })
})

test('Update an existing rank document with a different rank', async () => {
  const existingRank = {
    _id: RANK1,
    parentId: 'parent-id-1',
    userId: USER1,
    round: 1,
    rank: 'most',
    stage: 'pre',
    category: 'category-1',
    discussionId: 'discussion-1',
  }
  await Ranks.insertOne(existingRank)

  const updatedRankObj = {
    _id: RANK1,
    parentId: 'parent-id-1',
    round: 1,
    rank: 'least',
    stage: 'pre',
    category: 'category-1',
    discussionId: 'discussion-1',
  }

  const cb = jest.fn()

  await rankWhy.call({ synuser: { id: USER1 } }, updatedRankObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const rank = await Ranks.findOne({ _id: RANK1, userId: USER1 })
  expect(rank).toMatchObject({ ...updatedRankObj, userId: USER1 })
})

test('Fail if the user is not logged in', async () => {
  const rankObj = { parentId: 'parent-id-2', round: 1, rank: 'most' }
  const cb = jest.fn()

  await rankWhy.call({}, rankObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const rank = await Ranks.findOne({ parentId: 'parent-id-2' })
  expect(rank).toBeNull()
})

test('Fail if one of the required parameters is missing', async () => {
  const invalidRankObj = { round: 1, rank: 'most' } // Missing parentId
  const user = { id: USER1 }

  const cb = jest.fn()

  await rankWhy.call({ synuser: user }, invalidRankObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)

  const rank = await Ranks.findOne({ round: 1, rank: 'most' })
  expect(rank).toBeNull()
})
