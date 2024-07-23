// https://github.com/EnCiv/civil-pursuit/issues/163

import insertDturnStatement from '../insert-dturn-statement'

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'

// Config

const dTurnId = new ObjectId()
const synuser = { synuser: { id: '6667d5a33da5d19ddc304a6b' } }

const pointTitle = 'Point 1'
const pointDesc = 'Description 1 '
const pointObjNoId = { title: pointTitle, description: pointDesc }
const pointObjWithId = {
  _id: new ObjectId('6667d688b20d8e339ca50020'),
  title: pointTitle,
  description: pointDesc,
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
  await insertDturnStatement.call({}, dTurnId, pointObjNoId, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error.mock.calls[0][0]).toBe('Cannot insert Dturn statement - user is not logged in.')
})

test('Fail if discussion is not initialized.', async () => {
  const cb = jest.fn()
  await insertDturnStatement.call(synuser, dTurnId, pointObjNoId, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error.mock.calls[0][0]).toBe(`Discussion: ${dTurnId} not initialized`)
})
