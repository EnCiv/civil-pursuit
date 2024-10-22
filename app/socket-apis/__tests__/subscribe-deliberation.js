// https://github.com/EnCiv/civil-pursuit/issues/196

/**
 * @jest-environment jsdom
 */

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import { Iota, serverEvents } from 'civil-server'
import jestSocketApiSetup from '../../jest-socket-api-setup'
import socketApiSubscribe, { subscribeEventName } from '../socket-api-subscribe'
import { Discussions, initDiscussion, insertStatementId } from '../../dturn/dturn'

import clientIo from 'socket.io-client'

const handle = 'subscribe-deliberation'
const socketApiUnderTest = subscribeDeliberation

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
  await jestSocketApiSetup(userId, [[handle, socketApiUnderTest]])
})

afterAll(async () => {
  Mongo.disconnect()
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

  async function requestHandler(participants) {
    // Init the discussion if this is the first subscription
    if (participants > 0 && !Discussions[deliberationId]) {
      initDiscussion(deliberationId)
    }

    const point = {
      _id: new ObjectId('testPoint1'),
      title: 'Point 1',
      description: 'Description 1',
    }

    await Iota.create(point)
    serverEvents.emit(subscribeEventName('subscribe-discussion', deliberationId), point)

    console.log('Request was called')
  }
  function updateHandler(participants) {
    // Remove from memory if no subscribers remain
    if (participants === 0) {
      delete Discussions[deliberationId]
    }

    console.log('Update was called')
  }

  socketApiSubscribe(handle, discussionId, requestHandler, updateHandler)

  insertStatementId(discussionId, userId, 'testPoint1')
})
