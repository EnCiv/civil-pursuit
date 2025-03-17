// https://github.com/EnCiv/civil-pursuit/issues/206

const { MongoMemoryServer } = require('mongodb-memory-server')
const { MongoClient } = require('mongodb')
const getUserWhys = require('../get-user-whys')
const Points = require('../../models/points')

let memoryServer
let connection
let db
const userId = '12345678abcdefgh'
const synuser = { synuser: { id: userId } }

beforeAll(async () => {
  memoryServer = await MongoMemoryServer.create()
  const uri = memoryServer.getUri()
  connection = await MongoClient.connect(uri, { useNewUrlParser: true })
  db = connection.db()
  Points.find = db.collection('points').find.bind(db.collection('points'))
})

afterAll(async () => {
  await connection.close()
  await memoryServer.stop()
})

beforeEach(async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  await db.collection('points').deleteMany({})
})

afterEach(() => {
  console.error.mockRestore()
})

// Test 1: User not logged in
test('Return undefined if user is not logged in.', async () => {
  const cb = jest.fn()
  await getUserWhys.call({}, ['id1', 'id2'], cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error).toHaveBeenCalledWith('Cannot retrieve whys - user is not logged in.')
})

// Test 2: Return empty array if no data found
test('Return empty array if no data found.', async () => {
  const cb = jest.fn()

  await getUserWhys.call(synuser, ['nonexistentId'], cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith([])
  expect(console.error).not.toHaveBeenCalled()
})

// Test 3: Return list of 5 items
test('Return list of items matching parentId in ids.', async () => {
  const cb = jest.fn()

  // Mock the find function to return items where parentId is in ids
  const mockPoints = [
    { _id: '1', subject: 'Point1', userId, parentId: 'id1' },
    { _id: '2', subject: 'Point2', userId, parentId: 'id1' },
    { _id: '3', subject: 'Point3', userId, parentId: 'id2' },
    { _id: '4', subject: 'Point4', userId, parentId: 'id2' },
    { _id: '5', subject: 'Point5', userId, parentId: 'id1' },
    // These items should not be returned because their parentId is not in ['id1', 'id2']
    { _id: '6', subject: 'Point6', userId, parentId: 'id3' },
    { _id: '7', subject: 'Point7', userId, parentId: 'id4' },
    // These items should not be returned because their userId is not equals to current userId
    { _id: '8', subject: 'Point8', userId: userId + '0', parentId: 'id1' },
    { _id: '9', subject: 'Point9', userId: userId + '0', parentId: 'id2' },
  ]

  //Insert into the database
  await db.collection('points').insertMany(mockPoints)

  // Filter only the points where parentId is 'id1' or 'id2' and userId matches
  const expectedPoints = mockPoints.filter(point => ['id1', 'id2'].includes(point.parentId) && point.userId === userId)
  await getUserWhys.call(synuser, ['id1', 'id2'], cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(expectedPoints)
})

// Test 4: Ensure .catch() is triggered
test('Should trigger catch when database connection is closed.', async () => {
  const cb = jest.fn()

  // Close the connection to simulate a failure
  await connection.close()

  await getUserWhys.call(synuser, ['id1'], cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Failed to retrieve points - Points.find failed'))

  // Reconnect for other tests
  connection = await MongoClient.connect(memoryServer.getUri(), { useNewUrlParser: true })
  Points.find = db.collection('points').find.bind(db.collection('points'))
})
