// https://github.com/EnCiv/civil-pursuit/issues/133

import upsertWhy from '../upsert-why'
import Points from '../../models/points'
import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ObjectId } from 'mongodb'

const USER1 = '6667d5a33da5d19ddc304a6b'
const POINT1 = '6667d688b20d8e339ca50020'
const POINT2 = '6667e4eea414d31b20dffb2f'
const POINT3 = '6667d5a33da5d19ddc304a7c'
const PARENTID = 'parent-id'
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

test('Insert a new document', async () => {
  const pointObj = {
    _id: POINT1,
    title: 'Test Subject',
    description: 'Test Description',
    round: 1,
    parentId: PARENTID,
    category: 'most',
  }
  const user = { id: USER1 }

  const cb = jest.fn()

  await upsertWhy.call({ synuser: user }, pointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const point = await Mongo.db.collection('points').findOne({ title: 'Test Subject' })
  expect(point).toMatchObject({ ...pointObj, userId: USER1 })
})

test('Upsert changes to an existing document with its id set', async () => {
  const existingPoint = {
    _id: new ObjectId(POINT2),
    title: 'Existing Subject',
    description: 'Existing Description',
    round: 1,
    parentId: PARENTID,
    userId: USER1,
    category: 'most',
  }
  await Mongo.db.collection('points').insertOne(existingPoint)

  const existingDBPoint = await Mongo.db.collection('points').findOne({ _id: new ObjectId(POINT2) })
  expect(existingDBPoint).toMatchObject({ ...existingPoint})

  const updatedPointObj = {
    _id: POINT2,
    title: 'Updated Subject',
    description: 'Updated Description',
    round: 1,
    parentId: PARENTID,
    category: 'most',
  }
  const user = { id: USER1 }

  const cb = jest.fn()

  await upsertWhy.call({ synuser: user }, updatedPointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const updatedDBPoint = await Mongo.db.collection('points').findOne({ _id: new ObjectId(POINT2) })
  expect(updatedDBPoint).toMatchObject({ ...updatedPointObj })
})

test('User not logged in, not allowed to upsert a document', async () => {
  const pointObj = {
    _id: POINT3,
    title: 'Test Subject',
    description: 'Test Description',
    round: 1,
    parentId: PARENTID,
    category: 'most',
  }

  const cb = jest.fn()

  await upsertWhy.call({}, pointObj, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  const point = await Mongo.db.collection('points').findOne({ _id: new Object(POINT3)})
  expect(point).toBeNull()
})

test('Validation error when upserting a document', async () => {
  const invalidPointObj = {
    title: 'Test Subject',
    description: '',
    round: 1,
    parentId: PARENTID,
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
