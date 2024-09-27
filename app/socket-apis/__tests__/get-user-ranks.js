// https://github.com/EnCiv/civil-pursuit/issues/205

import getUserRanks from '../get-user-ranks'

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'

const Rankings = require('../../models/rankings')

// Config
const discussionId = '66a174b0c3f2051ad387d2a6'

const userId = '6667d5a33da5d19ddc304a6b'
const synuser = { synuser: { id: userId } }

let MemoryServer

beforeEach(async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(async () => {
  console.error.mockRestore()
})

beforeAll(async () => {
  MemoryServer = await MongoMemoryServer.create()
  const uri = MemoryServer.getUri()
  await Mongo.connect(uri)
})

afterAll(async () => {
  Mongo.disconnect()
  MemoryServer.stop()
})

// Tests
test('Fail if user is not logged in.', async () => {
  const cb = jest.fn()
  await getUserRanks.call({}, discussionId, 1, 'pre', cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error.mock.calls[0][0]).toMatch(/not logged in/)
})

test('Fail when arguments are invalid.', async () => {
  const cb = jest.fn()
  await getUserRanks.call(synuser, 100, 'wrong', 'pre', cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error.mock.calls[0][0]).toMatch(/Invalid arguments/)
})

test('Returns empty list if no results.', async () => {
  const cb = jest.fn()
  await getUserRanks.call(synuser, discussionId, 1, 'pre', cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith([])
})

test('Returns 10 results when 10 matches exist.', async () => {
  const cb = jest.fn()

  for (let num = 0; num < 10; num++) {
    const validDoc = {
      parentId: 'parent1',
      userId: userId,
      discussionId: discussionId,
      round: 1,
      stage: 'pre',
      category: 'category1',
    }
    const success = await Rankings.insertOne(validDoc)
    expect(success.acknowledged).toBe(true)
  }

  const results = await getUserRanks.call(synuser, discussionId, 1, 'pre', cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(results).toHaveLength(10)

  results.forEach(rank =>
    expect(rank).toMatchObject({
      _id: /./,
      parentId: 'parent1',
      userId: userId,
      discussionId: discussionId,
      round: 1,
      stage: 'pre',
      category: 'category1',
    })
  )
})
