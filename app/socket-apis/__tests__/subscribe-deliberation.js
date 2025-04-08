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
import { Discussions, getStatementIds, initDiscussion, insertStatementId, putGroupings, rankMostImportant } from '../../dturn/dturn'
import upsertPoint from '../upsert-point'

const handle = 'subscribe-deliberation'
const socketApiUnderTest = subscribeDeliberation

const userId = '6667d5a33da5d19ddc304a6b'
const synuser = { synuser: { id: userId } }

const discussionId = '66a174b0c3f2051ad387d2a6'

let MemoryServer

import subscribeDeliberation from '../subscribe-deliberation'

Iota.preload([
  {
    _id: { $oid: discussionId },
    path: '/deliberation1',
    subject: 'Deliberation',
    description: 'A descriptive discussion.',
    webComponent: {
      dturn: {
        max_rounds: 3,
      },
    },
  },
])

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

  await jestSocketApiSetup(userId, [[handle, socketApiUnderTest]])
})

afterAll(async () => {
  Mongo.disconnect()
  MemoryServer.stop()
  window.socket.close()
})

// Tests
test('If user not logged in, let them know the number of participantss', done => {
  subscribeDeliberation.call({}, discussionId, ({ participants }) => {
    expect(participants).toBe(0)
    done()
  })
})

test('Fail if deliberation ID not provided.', async () => {
  await subscribeDeliberation.call(synuser, null)

  expect(console.error.mock.calls[0][0]).toMatch(/DeliberationId was not provided/)
})
// this needs to be outside of any tests because it needs to be passed in through one test, and will get executed later when other tests trigger it
let updateHandlerDone
function updateHandler(data) {
  if (updateHandlerDone) updateHandlerDone(data)
  else console.error('updatehandler called, but updateHandlerDone was not set')
}

test('Successful request if deliberation exists.', done => {
  function requestHandler(data) {
    done()
  }
  socketApiSubscribe(handle, discussionId, requestHandler, updateHandler)
})

test('Check updateHandler is called.', done => {
  updateHandlerDone = data => {
    expect(data).toEqual({ participants: 1, lastRound: 0 })
    done()
  }
  const pointId = new ObjectId()
  const pointObj = { _id: pointId, title: 'Point 1', description: 'Description 1' }

  // this will trigger the update handler above
  upsertPoint
    .call(synuser, pointObj, () => {})
    .then(async () => {
      const insertResult = await insertStatementId(discussionId, userId, pointId)
      expect(insertResult).toBe(pointId)
    })
})

test('Check lastRound update.', done => {
  updateHandlerDone = data => {
    expect(data.lastRound).toBe(0)
  }

  // because jest erors on async (done)=>{}
  async function testAsync() {
    for (let num = 0; num < 99; num++) {
      const otherUserId = new ObjectId()
      const pointId = new ObjectId()
      const pointObj = { _id: pointId, title: 'Point 1', description: 'Description 1' }

      await upsertPoint.call({ synuser: { id: otherUserId } }, pointObj, () => {})

      const insertResult = await insertStatementId(discussionId, otherUserId, pointId)
      expect(insertResult).toBe(pointId)
    }

    const statements = await getStatementIds(discussionId, 0, userId)
    await putGroupings(discussionId, 0, userId, [])
    await rankMostImportant(discussionId, 0, userId, statements[0], 1)

    // change before the next getStatementIds which will cause the trigger
    updateHandlerDone = async data => {
      expect(data).toEqual({ participants: 100, lastRound: 1 })
      done()
    }

    // trigger the update with lastRound 1
    const roundOneStatements = await getStatementIds(discussionId, 1, userId)
  }
  testAsync()
})
