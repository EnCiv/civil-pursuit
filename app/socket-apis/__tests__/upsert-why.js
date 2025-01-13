// https://github.com/EnCiv/civil-pursuit/issues/133

import upsertWhy from '../upsert-why'
import Points from '../../models/points'
import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ObjectId } from 'mongodb'

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
  await Mongo.disconnect()
  await MemoryServer.stop()
})

beforeEach(async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(async () => {
  console.error.mockRestore()
})

test('Insert a new document with no id set', async () => {
  const pointObj = {
    subject: 'Test Subject',
    description: 'Test Description',
    round: 1,
    parentId: 'parent-id',
    category: 'most',
  }
  const user = { id: USER1 }

  const cb = jest.fn()

  await upsertWhy.call({ synuser: user }, pointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const point = await Points.findOne({ subject: 'Test Subject' })
  expect(point).toMatchObject({ ...pointObj, userId: USER1 })
})

test('Upsert changes to an existing document with its id set', async () => {
  const existingPoint = {
    _id: POINT1,
    subject: 'Existing Subject',
    description: 'Existing Description',
    round: 1,
    parentId: 'parent-id',
    userId: USER1,
    category: 'most',
  }
  await Points.insertOne(existingPoint)

  const updatedPointObj = {
    _id: POINT1,
    subject: 'Updated Subject',
    description: 'Updated Description',
    round: 1,
    parentId: 'parent-id',
    category: 'most',
  }
  const user = { id: USER1 }

  const cb = jest.fn()

  await upsertWhy.call({ synuser: user }, updatedPointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const point = await Points.findOne({ _id: POINT1 })
  expect(point).toMatchObject({ ...updatedPointObj, userId: USER1 })
})

test('User not logged in, not allowed to upsert a document', async () => {
  const pointObj = {
    _id: POINT2,
    subject: 'Test Subject',
    description: 'Test Description',
    round: 1,
    parentId: 'parent-id',
    category: 'most',
  }

  const cb = jest.fn()

  await upsertWhy.call({}, pointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const point = await Points.findOne({ _id: POINT2 })
  expect(point).toBeNull()
})

test('Validation error when upserting a document', async () => {
  const invalidPointObj = {
    // no subject, which is required
    description: 'invalidPointObj',
    round: 1,
    parentId: 'parent-id',
    category: 'most',
  }
  const user = { id: USER1 }

  const cb = jest.fn()

  await upsertWhy.call({ synuser: user }, invalidPointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(null)

  const point = await Points.findOne({ description: 'invalidPointObj' })
  expect(point).toBeNull()
})
