// https://github.com/EnCiv/civil-pursuit/issues/203
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongo } from '@enciv/mongo-collections'
import { MongoClient, ObjectId } from 'mongodb'
import Points from '../../models/points'
import getPointsOfIds from '../get-points-of-ids'

let memoryServer
let db

const synuser = { synuser: { id: 'user1' } }

beforeAll(async () => {
  memoryServer = await MongoMemoryServer.create()
  const uri = memoryServer.getUri()
  await Mongo.connect(uri) // Connect to Mongo using the provided MongoMemoryServer URI
  db = Mongo.db
  Points.setCollectionProps() // Set collection props if not already done in the model
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

test('Nothing found', async () => {
  const callback = jest.fn()

  await getPointsOfIds.call(synuser, [new ObjectId(), new ObjectId()], callback, 'user1')

  expect(callback).toHaveBeenCalledWith({
    points: [],
    myWhys: [],
  })
})

test('Points found, but no whypoints', async () => {
  const POINT_ID_1 = new ObjectId()
  const POINT_ID_2 = new ObjectId()

  // Insert sample points data
  await db.collection('points').insertMany([
    { _id: POINT_ID_1, title: 'Point 1', description: 'Description 1', userId: 'user1' },
    { _id: POINT_ID_2, title: 'Point 2', description: 'Description 2', userId: 'user2' },
  ])

  const callback = jest.fn()

  // Call the API and pass the correct context and synuser
  console.log('Calling getPointsOfIds API with synuser...')
  await getPointsOfIds([POINT_ID_1, POINT_ID_2], callback, 'user1', { id: 'user1' })

  console.log('API returned:', callback.mock.calls[0][0]) // Log the API response

  // Check if the callback was called with the correct points, adjusting for the removal of userId in POINT_ID_2
  expect(callback).toHaveBeenCalledWith({
    points: [
      { _id: POINT_ID_1, title: 'Point 1', description: 'Description 1', userId: 'user1' }, // userId kept
      { _id: POINT_ID_2, title: 'Point 2', description: 'Description 2' } // userId removed
    ],
    myWhys: [],
  })
})


test('Points and whypoints found', async () => {
  const POINT_ID_1 = new ObjectId() // Created by current user (user1)
  const POINT_ID_2 = new ObjectId() // Created by another user (user2)
  const WHYPOINT_ID_1 = new ObjectId() // A why point related to POINT_ID_1

  // Insert sample points data
  await db.collection('points').insertMany([
    { _id: POINT_ID_1, title: 'Point_ID_1', description: 'Description 1', userId: 'user1' },
    { _id: POINT_ID_2, title: 'Point_ID_2', description: 'Description 2', userId: 'user2' },
    {
      _id: WHYPOINT_ID_1,
      parentId: POINT_ID_1.toString(), // ParentId points to POINT_ID_1
      title: 'Why Point 1',
      description: 'Why Description 1',
      userId: 'user1', // Only whypoints created by user1 should be returned
    },
  ])

  const callback = jest.fn()

  // Call the API
  await getPointsOfIds([POINT_ID_1, POINT_ID_2], callback, 'user1', { id: 'user1' })

  // Check if the callback was called with the correct points and whypoints
  expect(callback).toHaveBeenCalledWith({
    points: [
      { _id: POINT_ID_1, title: 'Point_ID_1', description: 'Description 1', userId: 'user1' }, // userId is retained for POINT_ID_1
      { _id: POINT_ID_2, title: 'Point_ID_2', description: 'Description 2' } // userId is removed for POINT_ID_2 (created by another user)
    ],
    myWhys: [
      { _id: WHYPOINT_ID_1, parentId: POINT_ID_1.toString(), title: 'Why Point 1', description: 'Why Description 1', userId: 'user1' } // Whypoint belongs to POINT_ID_1 and was created by user1
    ]
  })
})


test('Some points created by other users, userId removed', async () => {
  const POINT_ID_1 = new ObjectId() // Created by current user (user1)
  const POINT_ID_2 = new ObjectId() // Created by another user (user2)

  // Insert sample points data, POINT_ID_1 created by user1, POINT_ID_2 by user2
  await db.collection('points').insertMany([
    { _id: POINT_ID_1, title: 'Point A by user1', description: 'Description A', userId: 'user1' },
    { _id: POINT_ID_2, title: 'Point B by user2', description: 'Description B', userId: 'user2' }
  ])

  const callback = jest.fn()

  // Call the API, passing 'user1' as the currentUserId
  console.log('Calling getPointsOfIds API with synuser...')
  await getPointsOfIds([POINT_ID_1, POINT_ID_2], callback, 'user1', { id: 'user1' })

  console.log('API returned:', callback.mock.calls[0][0]) // Log the API response

  // Check the returned points: POINT_ID_1 keeps userId, POINT_ID_2 should remove userId
  expect(callback).toHaveBeenCalledWith({
    points: [
      { _id: POINT_ID_1, title: 'Point A by user1', description: 'Description A', userId: 'user1' },
      { _id: POINT_ID_2, title: 'Point B by user2', description: 'Description B' } // userId should be removed for points created by user2
    ],
    myWhys: [],
  })
})
