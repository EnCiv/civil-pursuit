// https://github.com/EnCiv/civil-pursuit/issues/203
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongo } from '@enciv/mongo-collections'
import { ObjectId } from 'mongodb'
import Points from '../../models/points'
import getPointsOfIds from '../get-points-of-ids'

let memoryServer
let db

const synuser = { synuser: { id: 'user1' } }

beforeAll(async () => {
  memoryServer = await MongoMemoryServer.create()
  const uri = memoryServer.getUri()
  await Mongo.connect(uri)
  db = Mongo.db
  Points.setCollectionProps()
})

afterAll(async () => {
  await Mongo.disconnect()
  await memoryServer.stop()
})

beforeEach(async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(async () => {
  console.error.mockRestore()
})

// Test case 1: Nothing found (expect empty arrays)
test('Nothing found', async () => {
  const callback = jest.fn()

  // Call getPointsOfIds with `this` bound to `synuser`
  await getPointsOfIds.call(synuser, [new ObjectId(), new ObjectId()], callback)

  expect(callback).toHaveBeenCalledWith([], [])
})

// Test case 2: Points found, but no whypoints (expect only points)
test('Points found, but no whypoints', async () => {
  const POINT_ID_1 = new ObjectId()
  const POINT_ID_2 = new ObjectId()

  await db.collection('points').insertMany([
    { _id: POINT_ID_1, title: 'Point 1', description: 'Description 1', userId: 'user1' },
    { _id: POINT_ID_2, title: 'Point 2', description: 'Description 2', userId: 'user2' },
  ])

  const callback = jest.fn()

  await getPointsOfIds.call(synuser, [POINT_ID_1, POINT_ID_2], callback)

  expect(callback).toHaveBeenCalledWith([
    { _id: POINT_ID_1, title: 'Point 1', description: 'Description 1', userId: 'user1' },
    { _id: POINT_ID_2, title: 'Point 2', description: 'Description 2' } // userId removed
  ], [])
})

// Test case 3: Points and whypoints found (expect points and whypoints)
test('Points and whypoints found', async () => {
  const POINT_ID_1 = new ObjectId()
  const POINT_ID_2 = new ObjectId()
  const WHYPOINT_ID_1 = new ObjectId()

  await db.collection('points').insertMany([
    { _id: POINT_ID_1, title: 'Unique Point 1', description: 'Description 1', userId: 'user1' },
    { _id: POINT_ID_2, title: 'Unique Point 2', description: 'Description 2', userId: 'user2' },
    {
      _id: WHYPOINT_ID_1,
      parentId: POINT_ID_1.toString(),
      title: 'Why Point 1',
      description: 'Why Description 1',
      userId: 'user1',
    },
  ])

  const callback = jest.fn()

  await getPointsOfIds.call(synuser, [POINT_ID_1, POINT_ID_2], callback)

  expect(callback).toHaveBeenCalledWith([
    { _id: POINT_ID_1, title: 'Unique Point 1', description: 'Description 1', userId: 'user1' },
    { _id: POINT_ID_2, title: 'Unique Point 2', description: 'Description 2' }
  ], [
    { _id: WHYPOINT_ID_1, parentId: POINT_ID_1.toString(), title: 'Why Point 1', description: 'Why Description 1', userId: 'user1' }
  ])
})

// Test case 4: Some points created by other users, userId removed (expect filtered points)
test('Some points created by other users, userId removed', async () => {
  const POINT_ID_1 = new ObjectId()
  const POINT_ID_2 = new ObjectId()

  await db.collection('points').insertMany([
    { _id: POINT_ID_1, title: 'Point A by user1', description: 'Description A', userId: 'user1' },
    { _id: POINT_ID_2, title: 'Point B by user2', description: 'Description B', userId: 'user2' }
  ])

  const callback = jest.fn()

  await getPointsOfIds.call(synuser, [POINT_ID_1, POINT_ID_2], callback)

  expect(callback).toHaveBeenCalledWith([
    { _id: POINT_ID_1, title: 'Point A by user1', description: 'Description A', userId: 'user1' },
    { _id: POINT_ID_2, title: 'Point B by user2', description: 'Description B' } // userId removed
  ], [])
})

// Test case 5: Error handling (expect callback with undefined)
test('Error handling', async () => {
  const callback = jest.fn()

  // Call getPointsOfIds with invalid ObjectId to simulate an error
  await getPointsOfIds.call(synuser, ['invalid_id'], callback)

  expect(callback).toHaveBeenCalledWith(undefined)
  expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/Error fetching points or whypoints/))
})
