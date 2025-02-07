// https://github.com/EnCiv/civil-pursuit/issues/163

import insertDturnStatement from '../insert-dturn-statement'

import { initDiscussion, Discussions } from '../../dturn/dturn'

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'

const { BSON } = require('bson')

const Points = require('../../models/points')

// Config

const nonExistentDiscussionId = new ObjectId()
const existentDiscussionId = '66a174b0c3f2051ad387d2a6'

const userId = '6667d5a33da5d19ddc304a6b'
const synuser = { synuser: { id: userId } }

const pointObjNoId = { subject: 'NoIdTitle', description: 'NoIdDesc' }
const pointObjWithId = {
  _id: new ObjectId('6667d688b20d8e339ca50020'),
  subject: 'WithIdTitle',
  description: 'WithIdDesc',
}

let MemoryServer

const UInfoHistory = []

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

  await initDiscussion(existentDiscussionId, {
    updateUInfo: obj => {
      UInfoHistory.push(obj)
    },
  })
})

afterAll(async () => {
  Mongo.disconnect()
  MemoryServer.stop()
})

// Tests
test('Fail if user is not logged in.', async () => {
  const cb = jest.fn()
  await insertDturnStatement.call({}, nonExistentDiscussionId, pointObjNoId, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error.mock.calls[0][0]).toBe('Cannot insert Dturn statement - user is not logged in.')
})

test('Fail if discussion is not initialized.', async () => {
  const cb = jest.fn()
  await insertDturnStatement.call(synuser, nonExistentDiscussionId, pointObjNoId, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error.mock.calls[0][0]).toBe(`Discussion: ${nonExistentDiscussionId} not initialized`)
})

test('Success if discussion exists and pointObj ID provided.', async () => {
  const cb = jest.fn()
  await insertDturnStatement.call(synuser, existentDiscussionId, pointObjWithId, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(true)

  // Preexisting _id should've been converted to BSON.
  const insertedDoc = await Points.findOne({ _id: BSON.ObjectId.createFromHexString(pointObjWithId._id.toString()) })
  expect(insertedDoc).toEqual(pointObjWithId)
  expect(UInfoHistory).toMatchObject([
    {
      '6667d5a33da5d19ddc304a6b': {
        '66a174b0c3f2051ad387d2a6': {
          0: {
            shownStatementIds: {
              '6667d688b20d8e339ca50020': {
                rank: 0,
                author: true,
              },
            },
          },
        },
      },
    },
  ])
})

test('Success if discussion exists and pointObj ID not provided.', async () => {
  const cb = jest.fn()
  await insertDturnStatement.call(synuser, existentDiscussionId, pointObjNoId, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(true)

  // _id should've been set to a new ID.
  const insertedDoc = await Points.findOne({ subject: 'NoIdTitle', description: 'NoIdDesc' })
  expect(insertedDoc._id).not.toBeNaN

  const doctoredUInfoHistoryStr = JSON.stringify(UInfoHistory, null, 2).replace(insertedDoc._id.toString(), 'randomId1')
  //console.info('set toMatchObject to this:', doctoredUInfoHistoryStr) // for toMatchObject contents, temporarially uncomment this
  const doctoredUInfoHistory = JSON.parse(doctoredUInfoHistoryStr)

  expect(doctoredUInfoHistory).toMatchObject([
    {
      '6667d5a33da5d19ddc304a6b': {
        '66a174b0c3f2051ad387d2a6': {
          0: {
            shownStatementIds: {
              '6667d688b20d8e339ca50020': {
                rank: 0,
                author: true,
              },
            },
          },
        },
      },
    },
    {
      '6667d5a33da5d19ddc304a6b': {
        '66a174b0c3f2051ad387d2a6': {
          0: {
            shownStatementIds: {
              randomId1: {
                rank: 0,
                author: true,
              },
            },
          },
        },
      },
    },
  ])
})

test('Fail if pointObj insert fails.', async () => {
  const cb = jest.fn()
  const invalidPointObj = { subject: 'NoIdTitle', subject: 'NoIdDesc' }

  await insertDturnStatement.call(synuser, existentDiscussionId, invalidPointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)

  console.info(`Error: ${console.error.mock.calls[0][0]}`)
})

test('Fail if arguments are invalid', async () => {
  const cb = jest.fn()

  await insertDturnStatement.call(synuser, existentDiscussionId, cb)

  expect(console.error.mock.calls[0][0]).toEqual('Expected 3 arguments (dTurnId, pointObj, cb) but got 2.')

  console.info(`Error: ${console.error.mock.calls[0][0]}`)
})
