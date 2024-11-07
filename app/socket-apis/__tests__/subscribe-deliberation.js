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
import {
  Discussions,
  getStatementIds,
  initDiscussion,
  insertStatementId,
  putGroupings,
  rankMostImportant,
} from '../../dturn/dturn'
import upsertPoint from '../upsert-point'

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
test('Fail if user is not logged in.', async () => {
  await subscribeDeliberation.call({}, discussionId)

  expect(console.error.mock.calls[0][0]).toMatch(/user is not logged in/)
})

test('Fail if deliberation ID not provided.', async () => {
  await subscribeDeliberation.call(synuser, null)

  expect(console.error.mock.calls[0][0]).toMatch(/DeliberationId was not provided/)
})
// this needs to be outside of any tests because it needs to be passed in through one test, and will get executed later when other tests trigger it
let updateHandlerDone
function updateHandler(data) {
  //console.log('Update was called')
  if (updateHandlerDone) updateHandlerDone(data)
  else console.error('updatehandler called, but updateHandlerDone was not set')
}

test('Successful request if deliberation exists.', done => {
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

  Iota.create(anIota)
    .then(() => {
      function requestHandler(data) {
        console.log(data['participants'])
        console.log('Request was called')
        done()
      }

      socketApiSubscribe(handle, discussionId, requestHandler, updateHandler)
    })
    .catch(err => done(err))
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
    .then(() => {
      const insertResult = insertStatementId(discussionId, userId, pointId)
      expect(insertResult).toBe(pointId)
    })
})

test('Check lastRound update.', async done => {
  let num

  updateHandlerDone = data => {
    if (num === 101) {
      expect(data).toEqual({ participants: 101, lastRound: 1 })
      done()
    }
  }

  for (num = 0; num < 100; num++) {
    const otherUserId = new ObjectId()
    const pointId = new ObjectId()
    const pointObj = { _id: pointId, title: 'Point 1', description: 'Description 1' }

    // this will trigger the update handler above
    await upsertPoint
      .call({ synuser: { id: otherUserId } }, pointObj, () => {})
      .then(() => {
        const insertResult = insertStatementId(discussionId, otherUserId, pointId)
        expect(insertResult).toBe(pointId)
      })
  }

  const statements = await getStatementIds(discussionId, 0, userId)
  putGroupings(discussionId, 0, userId, [])
  rankMostImportant(discussionId, 0, userId, statements[0], 1)

  const roundOneStatements = await getStatementIds(discussionId, 1, userId)
  console.log('ROUND 1', roundOneStatements)
})
