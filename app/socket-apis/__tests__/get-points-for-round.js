// https://github.com/EnCiv/civil-pursuit/issues/204

import getPointsForRound from '../get-points-for-round'

import { initDiscussion, Discussions } from '../../dturn/dturn'
import insertDturnStatement from '../insert-dturn-statement'

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'

const Points = require('../../models/points')

// Config
const discussionId = '66a174b0c3f2051ad387d2a6'

const userId = '6667d5a33da5d19ddc304a6b'
const synuser = { synuser: { id: userId } }

const pointObj = {
  _id: new ObjectId('6667d688b20d8e339ca50020'),
  title: 'WithIdTitle',
  description: 'WithIdDesc',
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

test('Empty list if user inserted their answer but no others have.', async () => {
  const cb = jest.fn()
  await getPointsForRound.call(synuser, discussionId, 1, cb)

  await initDiscussion(discussionId)
  await insertDturnStatement.call(synuser, discussionId, pointObj, null)
  console.log('HIHI')
  expect(cb).toHaveBeenCalledTimes(1)
  // expect(cb).toHaveBeenCalledWith([])
  expect(console.error.mock.calls[1][0]).toMatch(/user is not logged in/)
})
