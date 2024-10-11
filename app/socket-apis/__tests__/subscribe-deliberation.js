// https://github.com/EnCiv/civil-pursuit/issues/196

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import { Iota } from 'civil-server'

const userId = '6667d5a33da5d19ddc304a6b'
const synuser = { synuser: { id: userId } }

const discussionId = '66a174b0c3f2051ad387d2a6'

let MemoryServer

import subscribeDeliberation from '../subscribe-deliberation'

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
  await subscribeDeliberation.call({}, discussionId)

  expect(console.error.mock.calls[0][0]).toMatch(/user is not logged in/)
})

test('Fail if deliberation ID not provided.', async () => {
  await subscribeDeliberation.call(synuser, null)

  expect(console.error.mock.calls[0][0]).toMatch(/DeliberationId was not provided/)
})

test('Succeed if deliberation exists.', async () => {
  const anIota = {
    _id: new ObjectId(discussionId),
    path: '/deliberation1',
    subject: 'Deliberation',
    description: 'A descriptive discussion.',
    webComponent: {
      dturn: {
        max_rounds: 3,
      },
    },
  }

  const iota = await Iota.create(anIota)
  expect(iota).toMatchObject(anIota)

  await subscribeDeliberation.call(synuser, discussionId)

  expect(console.error.mock.calls[0][0]).toMatch(/DeliberationId was not provided/)
})
