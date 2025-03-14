// https://github.com/EnCiv/civil-pursuit/issues/204

import getPointsForRound from '../get-points-for-round'

import { initDiscussion, Discussions } from '../../dturn/dturn'
import insertDturnStatement from '../insert-dturn-statement'

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'

const Points = require('../../models/points')
import upsertPoint from '../upsert-point'

// Config
const discussionId = '66a174b0c3f2051ad387d2a6'

const userId = '6667d5a33da5d19ddc304a6b'
const otherUserId = 'otheruser'

const synuser = { synuser: { id: userId } }

const pointObj1 = {
  _id: new ObjectId('6667d688b20d8e339ca50020'),
  subject: 'Point1',
  description: 'Point1',
}

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
  await getPointsForRound.call({}, discussionId, 1, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error.mock.calls[0][0]).toMatch(/user is not logged in/)
})

test('Fail if discussionId not initialized.', async () => {
  const cb = jest.fn()
  await getPointsForRound.call(synuser, discussionId, 1, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error.mock.calls[0][0]).toMatch(/getStatementIds failed/)
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
  expect(console.error.mock.calls[console.error.mock.calls.length - 1][0]).toMatch(
    /Insufficient ShownStatements length/
  )
})

test('Populated list if other users have submitted their answers.', async () => {
  const cb = jest.fn()
  const insertCb = jest.fn()

  await initDiscussion(discussionId)

  await insertDturnStatement.call(synuser, discussionId, pointObj1, insertCb)
  expect(insertCb).toHaveBeenCalledWith(true)

  for (let num = 0; num < 20; num++) {
    await insertDturnStatement.call(
      { synuser: { id: otherUserId } },
      discussionId,
      {
        _id: new ObjectId(),
        subject: num,
        description: num,
      },
      insertCb
    )
    expect(insertCb).toHaveBeenCalledWith(true)
    expect(insertCb).toHaveBeenCalledTimes(num + 2)
  }

  let points = await getPointsForRound.call(synuser, discussionId, 0, cb)
  expect(points.length).toBeGreaterThan(0)
  expect(cb).toHaveBeenCalledTimes(1)

  // Check other points are anonymized
  for (const point of points) {
    if (point.userId !== userId) expect(point.userId).toBeUndefined
  }

  // Test when users are removed from points
  for (const point of points) {
    await upsertPoint.call(synuser, { userId: null, ...point }, () => {})
  }

  points = await getPointsForRound.call(synuser, discussionId, 0, cb)

  expect(points?.length === 0 || points?.length === undefined).toBe(true)
  expect(cb).toHaveBeenCalledTimes(2)
})
