// https://github.com/EnCiv/civil-pursuit/issues/129

import upsertPoint from '../upsert-point'
import Points from '../../models/points'
import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'

const USER1 = '6667d5a33da5d19ddc304a6b'
const POINT1 = new ObjectId('6667d688b20d8e339ca50020')
const POINT2 = new ObjectId('6667e4eea414d31b20dffb2f')
let MemoryServer
beforeAll(async () => {
  MemoryServer = await MongoMemoryServer.create()
  const uri = MemoryServer.getUri()
  await Mongo.connect(uri)
})

afterAll(async () => {
  Mongo.disconnect()
  MemoryServer.stop()
})

test('Upsert a new document', async () => {
  const pointObj = { _id: POINT1, subject: 'Point 1', description: 'Description 1' }
  const user = { id: USER1 }

  const cb = jest.fn()

  await upsertPoint.call({ synuser: user }, pointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const point = await Points.findOne({ _id: POINT1 })
  expect(point).toEqual({ ...pointObj, userId: USER1 })
})

test('Upsert changes to an existing document', async () => {
  const pointObj = { _id: POINT1, subject: 'Updated Point 1', description: 'Updated Description 1' }
  const user = { id: USER1 }

  const cb = jest.fn()

  await upsertPoint.call({ synuser: user }, pointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const point = await Points.findOne({ _id: POINT1 })
  expect(point).toEqual({ ...pointObj, userId: USER1 })
})

test('User not logged in, not allowed to upsert a document', async () => {
  const pointObj = { _id: POINT2, subject: 'Point 2', description: 'Description 2' }
  const cb = jest.fn()

  await upsertPoint.call({}, pointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const point = await Points.findOne({ _id: POINT2 })
  expect(point).toBeNull()
})

test('Validation error when upserting a document', async () => {
  const invalidPointObj = { _id: POINT2, subject: '', description: 'Description 2' } // Assuming subject is a required field
  const user = { id: USER1 }

  // Mock the validate method to return an error
  Points.validate = jest.fn().mockReturnValue({ error: 'Validation error' })

  const cb = jest.fn()

  await upsertPoint.call({ synuser: user }, invalidPointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb.mock.calls[0][0]).toBeUndefined()
  const point = await Points.findOne({ _id: POINT2 })
  expect(point).toBeNull()
})
