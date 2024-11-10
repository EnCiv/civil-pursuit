// https://github.com/EnCiv/civil-pursuit/issues/203
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongo } from '@enciv/mongo-collections'
import { ObjectId } from 'mongodb'
import Points from '../../models/points'
import getPointsOfIds from '../get-points-of-ids'

let memoryServer
let db

// Use a valid hex-like ObjectId string for synuser
const synuser = { synuser: { id: '1234567890abcdef12345678' } }

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

  // Call getPointsOfIds with stringified ObjectIds
  await getPointsOfIds.call(synuser, [new ObjectId().toString(), new ObjectId().toString()], callback)

  expect(callback).toHaveBeenCalledWith({ points: [], myWhys: [] })
})

// Test case 2: Points found, but no whypoints (expect only points)
test('Points found, but no whypoints', async () => {
  const POINT_ID_1 = new ObjectId().toString()
  const POINT_ID_2 = new ObjectId().toString()

  await db.collection('points').insertMany([
    { _id: new ObjectId(POINT_ID_1), title: 'Point 1', description: 'Description 1', userId: synuser.synuser.id },
    { _id: new ObjectId(POINT_ID_2), title: 'Point 2', description: 'Description 2', userId: 'abcdefabcdefabcdefabcdef' }, // Different user
  ])

  const callback = jest.fn()

  await getPointsOfIds.call(synuser, [POINT_ID_1.toString(), POINT_ID_2.toString()], callback)

  expect(callback).toHaveBeenCalledWith({
    points: [
      { _id: new ObjectId(POINT_ID_1), title: 'Point 1', description: 'Description 1', userId: synuser.synuser.id },
      { _id: new ObjectId(POINT_ID_2), title: 'Point 2', description: 'Description 2' } // userId removed for different user
    ],
    myWhys: []
  })
})

// Test case 3: Points and whypoints found (expect points and whypoints)
test('Points and whypoints found', async () => {
  const POINT_ID_1 = new ObjectId().toString()
  const POINT_ID_2 = new ObjectId().toString()
  const WHYPOINT_ID_1 = new ObjectId().toString()

  await db.collection('points').insertMany([
    { _id: new ObjectId(POINT_ID_1), title: 'Unique Point 1', description: 'Description 1', userId: synuser.synuser.id },
    { _id: new ObjectId(POINT_ID_2), title: 'Unique Point 2', description: 'Description 2', userId: 'abcdefabcdefabcdefabcdef' }, // Different user
    {
      _id: new ObjectId(WHYPOINT_ID_1),
      parentId: POINT_ID_1,
      title: 'Why Point 1',
      description: 'Why Description 1',
      userId: synuser.synuser.id, // Created by the current user
    },
  ])

  const callback = jest.fn()

  await getPointsOfIds.call(synuser, [POINT_ID_1.toString(), POINT_ID_2.toString()], callback)

  expect(callback).toHaveBeenCalledWith({
    points: [
      { _id: new ObjectId(POINT_ID_1), title: 'Unique Point 1', description: 'Description 1', userId: synuser.synuser.id },
      { _id: new ObjectId(POINT_ID_2), title: 'Unique Point 2', description: 'Description 2' }
    ],
    myWhys: [
      { _id: new ObjectId(WHYPOINT_ID_1), parentId: POINT_ID_1, title: 'Why Point 1', description: 'Why Description 1', userId: synuser.synuser.id }
    ]
  })
})

// Test case 4: Some points created by other users, userId removed (expect filtered points)
test('Some points created by other users, userId removed', async () => {
  const POINT_ID_1 = new ObjectId().toString()
  const POINT_ID_2 = new ObjectId().toString()

  await db.collection('points').insertMany([
    { _id: new ObjectId(POINT_ID_1), title: 'Point A by user1', description: 'Description A', userId: synuser.synuser.id },
    { _id: new ObjectId(POINT_ID_2), title: 'Point B by user2', description: 'Description B', userId: 'abcdefabcdefabcdefabcdef' }
  ])

  const callback = jest.fn()

  await getPointsOfIds.call(synuser, [POINT_ID_1.toString(), POINT_ID_2.toString()], callback)

  expect(callback).toHaveBeenCalledWith({
    points: [
      { _id: new ObjectId(POINT_ID_1), title: 'Point A by user1', description: 'Description A', userId: synuser.synuser.id },
      { _id: new ObjectId(POINT_ID_2), title: 'Point B by user2', description: 'Description B' } // userId removed for points created by another user
    ],
    myWhys: []
  })
})

// Test case 5: Error handling (expect callback with undefined)
test('Error handling', async () => {
  const callback = jest.fn()

  // Call getPointsOfIds with invalid ObjectId to simulate an error
  await getPointsOfIds.call(synuser, ['invalid_id'], callback)

  expect(callback).toHaveBeenCalledWith(undefined)
  expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/Error fetching points or whypoints/))
})
