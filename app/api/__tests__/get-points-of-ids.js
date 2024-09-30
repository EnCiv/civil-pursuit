import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongo } from '@enciv/mongo-collections'
import { MongoClient, ObjectId } from 'mongodb'
import Points from '../../models/points'
import getPointsOfIds from '../get-points-of-ids'

let memoryServer
let db

beforeAll(async () => {
  memoryServer = await MongoMemoryServer.create()
  const uri = memoryServer.getUri()
  await Mongo.connect(uri) // Connect to Mongo using the provided MongoMemoryServer URI

  db = Mongo.db

  // Ensure that Points is properly initialized
  Points.setCollectionProps() // Set collection props if not already done in the model
})

afterAll(async () => {
  await Mongo.disconnect()
  await memoryServer.stop()
})

test('Nothing found', async () => {
  const callback = jest.fn()

  await getPointsOfIds([new ObjectId(), new ObjectId()], callback) // Pass non-existent IDs

  expect(callback).toHaveBeenCalledWith({
    points: {},
    myWhys: {},
  })
})

test('Points found, but no whypoints', async () => {
  // Insert sample points data
  const POINT_ID_1 = new ObjectId()
  const POINT_ID_2 = new ObjectId()

  await db.collection('points').insertMany([
    { _id: POINT_ID_1, title: 'Point 1', description: 'Description 1', userId: 'user1' },
    { _id: POINT_ID_2, title: 'Point 2', description: 'Description 2', userId: 'user2' },
  ])

  const callback = jest.fn()

  // Call the getPointsOfIds function
  await getPointsOfIds([POINT_ID_1, POINT_ID_2], callback)

  // Check the expected callback behavior
  expect(callback).toHaveBeenCalledWith({
    points: {
      [POINT_ID_1.toHexString()]: {
        _id: POINT_ID_1,
        title: 'Point 1',
        description: 'Description 1',
        userId: 'user1',
      },
      [POINT_ID_2.toHexString()]: {
        _id: POINT_ID_2,
        title: 'Point 2',
        description: 'Description 2',
        userId: 'user2',
      },
    },
    myWhys: {},
  })
})

test('Points and whypoints found', async () => {
  const POINT_ID_1 = new ObjectId()
  const POINT_ID_2 = new ObjectId()
  const WHYPOINT_ID_1 = new ObjectId() // A why point related to POINT_ID_1

  await db.collection('points').insertMany([
    { _id: POINT_ID_1, title: 'Unique Point 1', description: 'Description 1', userId: 'user1' },
    { _id: POINT_ID_2, title: 'Unique Point 2', description: 'Description 2', userId: 'user2' },
    {
      _id: WHYPOINT_ID_1,
      parentId: POINT_ID_1,
      title: 'Why Point 1',
      description: 'Why Description 1',
      userId: 'user1',
    },
  ])

  const callback = jest.fn()

  await getPointsOfIds([POINT_ID_1, POINT_ID_2], callback)

  expect(callback).toHaveBeenCalledWith({
    points: {
      [POINT_ID_1.toHexString()]: {
        _id: POINT_ID_1,
        title: 'Unique Point 1',
        description: 'Description 1',
        userId: 'user1',
      },
      [POINT_ID_2.toHexString()]: {
        _id: POINT_ID_2,
        title: 'Unique Point 2',
        description: 'Description 2',
        userId: 'user2',
      },
    },
    myWhys: {
      [POINT_ID_1.toHexString()]: [
        {
          _id: WHYPOINT_ID_1,
          parentId: POINT_ID_1,
          title: 'Why Point 1',
          description: 'Why Description 1',
          userId: 'user1',
        },
      ],
    },
  })
})
