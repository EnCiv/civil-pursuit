// https://github.com/EnCiv/civil-pursuit/issues/196

/**
 * @jest-environment jsdom
 */

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import { Iota, serverEvents } from 'civil-server'
import jestSocketApiSetup, { jestSocketApiTeardown } from '../../jest-socket-api-setup'
import socketApiSubscribe, { subscribeEventName } from '../socket-api-subscribe'
import { Discussions, getStatementIds, initDiscussion, insertStatementId, finishRound } from '../../dturn/dturn'
import upsertPoint from '../upsert-point'

const handle = 'subscribe-deliberation'
const socketApiUnderTest = subscribeDeliberation

const userId = '6667d5a33da5d19ddc304a6b'
const synuser = { synuser: { id: userId } }

const socketThis = {
  server: {
    to: (...args) => {
      if (!window.socket?.emit) console.log('window.socket.emit is not defined yet')
      if (!window.socket.originalEmit) window.socket.originalEmit = window.socket.emit
      window.socket.emit = (...args) => {
        return window.socket.originalEmit(...args)
      }
      return window.socket
    },
  },
}

const discussionId = '66a174b0c3f2051ad387d2a6'

let MemoryServer

import subscribeDeliberation from '../subscribe-deliberation'
import { last, update } from 'lodash'

Iota.preload([
  {
    _id: { $oid: discussionId },
    path: '/deliberation1',
    subject: 'Deliberation',
    description: 'A descriptive discussion.',
    webComponent: {
      dturn: {
        group_size: 5,
        finalRound: 2,
      },
    },
  },
])

beforeEach(async () => {
  await jestSocketApiSetup(userId, [[handle, socketApiUnderTest]])
  jest.spyOn(console, 'error').mockImplementation((...args) => console.log(...args))
})

afterEach(async () => {
  console.error.mockRestore()
  delete Discussions[discussionId]
  jestSocketApiTeardown()
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
let updateHandlerDone
function updateHandler(data) {
  if (updateHandlerDone) updateHandlerDone(data)
  else console.error('updatehandler called, but updateHandlerDone was not set')
}
// Tests
test('If user not logged in, let them know the number of participants', done => {
  subscribeDeliberation.call(socketThis, discussionId, results => {
    const { participants } = results
    expect(participants).toBe(0) // because deliberation not loaded yet, participants should be undefined
    done()
  })
})

test('Fail if deliberation ID not provided.', done => {
  subscribeDeliberation.call({ ...socketThis, ...synuser }, null, data => {
    expect(console.error.mock.calls[0][0]).toMatch(/DeliberationId was not provided/)
    done()
  })
})
// this needs to be outside of any tests because it needs to be passed in through one test, and will get executed later when other tests trigger it

function createFunctionThatResolvesAPromise() {
  let resolveFunction
  const promise = new Promise((resolve, reject) => {
    resolveFunction = data => {
      console.info('function resolve(data) called with:', data)
      resolve(data)
    }
  })
  return [promise, resolveFunction]
}
test('Successful request if deliberation exists.', async () => {
  const [requestHandled, requestHandler] = createFunctionThatResolvesAPromise()
  const [updateHandled, updateHandler] = createFunctionThatResolvesAPromise()

  socketApiSubscribe(handle, discussionId, requestHandler, updateHandler)
  const requestResult = await requestHandled
  expect(requestResult).toMatchObject({
    participants: 0,
    uInfo: [
      {
        userId: '6667d5a33da5d19ddc304a6b',
        shownStatementIds: {},
        groupings: [],
      },
    ],
  })
})

test('Successful request if deliberation exists and can get an update.', async () => {
  const [requestHandled, requestHandler] = createFunctionThatResolvesAPromise()
  const [updateHandled, updateHandler] = createFunctionThatResolvesAPromise()

  socketApiSubscribe(handle, discussionId, requestHandler, updateHandler)
  const requestResult = await requestHandled
  expect(requestResult).toMatchObject({
    participants: 0,
    uInfo: [
      {
        userId: '6667d5a33da5d19ddc304a6b',
        shownStatementIds: {},
        groupings: [],
      },
    ],
  })

  const pointId = new ObjectId()
  const pointObj = { _id: pointId, subject: 'Point 1', description: 'Description 1' }

  // this will trigger the update handler above
  upsertPoint
    .call(synuser, pointObj, () => {})
    .then(async () => {
      const insertResult = await insertStatementId(discussionId, userId, pointId)
      expect(insertResult).toBe(pointId)
    })
  const updateResult = await updateHandled
  expect(updateResult).toMatchObject({ participants: 1, lastRound: 0 })
})

test('Check lastRound update.', async () => {
  const [requestHandled, requestHandler] = createFunctionThatResolvesAPromise()
  const updateHandler = jest.fn()

  socketApiSubscribe(handle, discussionId, requestHandler, updateHandler)
  const requestResult = await requestHandled
  expect(requestResult).toMatchObject({
    participants: 1,
    lastRound: 0,
    uInfo: [
      {
        userId: '6667d5a33da5d19ddc304a6b',
        shownStatementIds: {},
        groupings: [],
      },
    ],
  })

  const userIds = [userId]
  for (let num = 0; num < 100; num++) {
    const otherUserId = new ObjectId().toString()
    userIds.push(otherUserId)
    const pointId = new ObjectId()
    const pointObj = { _id: pointId, subject: `${num}`, description: `Description ${num}` }

    await upsertPoint.call({ synuser: { id: otherUserId } }, pointObj, () => {})

    const insertResult = await insertStatementId(discussionId, otherUserId, pointId.toString())
    expect(insertResult).toBe(pointId.toString())
  }

  const firstBatchUserIDs = userIds.slice(0, 50)

  for await (const userId of firstBatchUserIDs) {
    const statements = await getStatementIds(discussionId, 0, userId)
    console.log('statements for userId', userId, statements?.length)
    expect(statements.length).toBe(5)
    // sort statements by id and rank the largest 2 as 1 - being lazy so we don't have to store and lookup pointObjs
    statements.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
    const ranks = [{ [statements[4]]: 1 }, { [statements[3]]: 1 }]
    const finishRoundResult = await finishRound(discussionId, 0, userId, ranks, [])
    expect(finishRoundResult).toBe(true)
  }
  expect(updateHandler.mock.calls.length).toBe(100)
  expect(updateHandler.mock.calls[0][0]).toEqual({ participants: 2, lastRound: 0 })
  expect(updateHandler.mock.calls[99][0]).toEqual({ participants: 101, lastRound: 0 })

  const statementsAfter = await getStatementIds(discussionId, 1, userId)
  expect(statementsAfter.length).toBe(5)
  expect(updateHandler.mock.calls[100][0]).toEqual({ participants: 101, lastRound: 1 })
  expect(statementsAfter.length).toBe(5)
})
