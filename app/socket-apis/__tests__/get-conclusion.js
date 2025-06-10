// https://github.com/EnCiv/civil-pursuit/issues/305

import getConclusion from '../get-conclusion'
import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { initDiscussion, insertStatementId, Discussions } from '../../dturn/dturn'
import { proxyUser, proxyUserReturn } from '../../dturn/test'

const ObjectID = require('bson-objectid')

let MemoryServer

const DISCUSSION_ID = 1
const DISCUSSION_ID2 = 10

const userId = '6667d5a33da5d19ddc304a6b'
const synuser = { synuser: { id: userId } }

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

  initDiscussion(DISCUSSION_ID, {
    group_size: 5,
    gmajority: 0.9,
    max_rounds: 10,
    min_shown_count: 6,
    min_rank: 3,
    updateUInfo: () => {},
    getAllUInfo: async () => [],
  })
})

afterAll(async () => {
  await Mongo.disconnect()
  await MemoryServer.stop()
})

test('Fail if discussionId not provided', async () => {
  const cb = jest.fn()

  await getConclusion.call({}, undefined, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
})

test('Fail if conclusion not available/discussion not complete.', async () => {
  const cb = jest.fn()

  const statement = {
    _id: ObjectID().toString(),
    subject: 'proxy random number',
    description: 'desc 1',
    userId: synuser.id,
  }

  await insertStatementId(DISCUSSION_ID, synuser.id, statement._id)

  await getConclusion.call({ synuser: synuser }, DISCUSSION_ID, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)

  expect(console.error.mock.calls[console.error.mock.calls.length - 2][0]).toMatch(/not complete/)
})

test('Return data if discussion is complete.', async () => {
  const cb = jest.fn()

  initDiscussion(DISCUSSION_ID2, {
    group_size: 5,
    gmajority: 0.9,
    max_rounds: 10,
    min_shown_count: 6,
    min_rank: 3,
    updateUInfo: () => {},
    getAllUInfo: async () => [],
  })

  const UserIds = []

  for (let i = 0; i < 5; i++) {
    await proxyUser(DISCUSSION_ID2)
  }

  let i = 0
  for (const userId of UserIds) {
    await proxyUserReturn(userId, 0, DISCUSSION_ID2)
  }
  if (Discussions[DISCUSSION_ID2].ShownStatements.at(-1).length > Discussions[DISCUSSION_ID2].group_size) {
    i = 0
    const final = Discussions[DISCUSSION_ID2].ShownStatements.length - 1

    for (const userId of UserIds) {
      await proxyUserReturn(userId, final)
    }
  }

  await getConclusion.call({ synuser: synuser }, DISCUSSION_ID2, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith({})
})
