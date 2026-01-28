// https://github.com/EnCiv/civil-pursuit/issues/204

import getPointsForRound from '../get-points-for-round'

import { initDiscussion, Discussions } from '../../dturn/dturn'
import insertDturnStatement from '../insert-dturn-statement'

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ObjectId } from 'mongodb'
import { expect } from '@jest/globals'

// Config
const discussionId = '66a174b0c3f2051ad387d2a6'

const userId = '6667d5a33da5d19ddc304a6b'

const synuser = { synuser: { id: userId } }

const pointObj1 = {
  _id: '6667d688b20d8e339ca50020',
  subject: 'Point1',
  description: 'Point1',
}

let MemoryServer

beforeEach(async () => {
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    console.log(...args)
  }) // Mock console.error to capture errors
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
  await getPointsForRound.call({}, discussionId, 1, cb)

  expect(cb).toHaveBeenCalledTimes(1)

  expect(console.error.mock.calls[0][0]).toMatch(/user is not logged in/)
})

test('Fail if discussionId not initialized.', async () => {
  const cb = jest.fn()
  await getPointsForRound.call(synuser, 'discussionId', 1, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith([])
  expect(console.error.mock.calls[0][0]).toBeDefined()
})

test('Fail if invalid arguments provided.', async () => {
  await initDiscussion(discussionId)
  await getPointsForRound.call(synuser, 0)

  expect(console.error.mock.calls[console.error.mock.calls.length - 1][0]).toMatch(/Invalid arguments provided/)
})

test('Empty list if user inserted their answer but no others have.', async () => {
  const cb = jest.fn()
  const insertCb = jest.fn()

  await initDiscussion(discussionId)

  await insertDturnStatement.call(synuser, discussionId, pointObj1, insertCb)
  expect(insertCb).toHaveBeenCalledWith(true)

  await getPointsForRound.call(synuser, discussionId, 0, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith([])
  expect(console.error.mock.calls[console.error.mock.calls.length - 1][0]).toMatch(/Insufficient ShownStatements length/)
})

test('Populated list if other users have submitted their answers.', async () => {
  await initDiscussion(discussionId)

  await new Promise(ok => insertDturnStatement.call(synuser, discussionId, pointObj1, result => ok(result)))

  const nums = Array.from({ length: 20 }, (_, i) => i)
  const promises = nums.map(
    num =>
      new Promise(ok => {
        insertDturnStatement.call(
          { synuser: { id: new ObjectId().toString() } },
          discussionId,
          {
            _id: new ObjectId().toString(),
            subject: num + '',
            description: num + '',
          },
          result => ok(result)
        )
      })
  )
  await Promise.all(promises)

  let points = await new Promise(ok => getPointsForRound.call(synuser, discussionId, 0, result => ok(result)))
  expect(points.length).toBe(Discussions[discussionId].group_size)

  // Check other points are anonymized
  for (const point of points) {
    if (point.userId !== userId) expect(point.userId).toBeUndefined()
  }
  expect(console.error.mock.calls.length).toBe(0)
})
