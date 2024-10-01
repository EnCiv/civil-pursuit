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

test('Insert a new document when valid request with no id set', async () => {
  const pointObj = {
    title: 'Test Subject',
    description: 'Test Description',
    round: 1,
    parentId: 'parent-id',
    category: 'most',
  }
  const user = { id: USER1 }

  const cb = jest.fn()

  await upsertWhy.call({ synuser: user }, pointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const point = await Mongo.db.collection('points').findOne({ title: 'Test Subject' })
  expect(point).toMatchObject({ ...pointObj, userId: USER1 })
})

test('Upsert changes to an existing document when valid request with its id set', async () => {
  const existingPoint = {
    _id: POINT1,
    title: 'Existing Subject',
    description: 'Existing Description',
    round: 1,
    parentId: 'parent-id',
    userId: USER1,
    category: 'most',
  }
  await Mongo.db.collection('points').insertOne(existingPoint)

  const updatedPointObj = {
    _id: POINT1,
    title: 'Updated Subject',
    description: 'Updated Description',
    round: 1,
    parentId: 'parent-id',
    category: 'most',
  }
  const user = { id: USER1 }

  const cb = jest.fn()

  await upsertWhy.call({ synuser: user }, updatedPointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const point = await Mongo.db.collection('points').findOne({ _id: POINT1 })
  expect(point).toMatchObject({ ...updatedPointObj, userId: USER1 })
})

test('User not logged in, not allowed to upsert a document', async () => {
  const pointObj = {
    _id: POINT2,
    title: 'Test Subject',
    description: 'Test Description',
    round: 1,
    parentId: 'parent-id',
    category: 'most',
  }

  const cb = jest.fn()

  await upsertWhy.call({}, pointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const point = await Mongo.db.collection('points').findOne({ _id: POINT2})
  expect(point).toBeNull()
})

test('Validation error when upserting a document', async () => {
  const invalidPointObj = {
    title: 'Test Subject',
    description: '',
    round: 1,
    parentId: 'parent-id',
    category: 'most',
  }
  const user = { id: USER1 }

  // Mock the validate method to return an error
  Points.validate = jest.fn().mockReturnValue({ error: 'Validation error' })

  const cb = jest.fn()

  await upsertWhy.call({ synuser: user }, invalidPointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(null)

  const point = await Mongo.db.collection('points').findOne({ subject: 'Test Subject' })
  expect(point).toBeNull()
})

test('error when category in request is missing', async () => {
  const pointObj = {
    id: POINT1,
    title: 'Test Subject',
    description: '',
    round: 1,
    parentId: 'parent-id',
    // category is missing
  };
  const user = { id: USER1 }
  const cb = jest.fn()

  await upsertWhy.call({ synuser: user }, pointObj, cb)

  // validation error
  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(null)
});

test('error when category in request is not valid', async () => {
  const pointObj = {
    id: POINT1,
    title: 'Test Subject',
    description: '',
    round: 1,
    parentId: 'parent-id',
    category: 'Invalid'
    // category invalid
  };
  const user = { id: USER1 }
  const cb = jest.fn()

  await upsertWhy.call({ synuser: user }, pointObj, cb)

  // validation error
  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(null)
})