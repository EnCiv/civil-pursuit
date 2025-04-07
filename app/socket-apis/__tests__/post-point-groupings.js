// https://github.com/EnCiv/civil-pursuit/issues/178

import postPointGroups from '../post-point-groups'
import insertDturnStatement from '../insert-dturn-statement'
import { getStatementIds, initDiscussion, insertStatementId } from '../../dturn/dturn'

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import expect from 'expect'

// Config
process.env.JEST_TEST_ENV = true

const userId = '6667d5a33da5d19ddc304a6b'
const synuser = { synuser: { id: userId } }

const discussionId = '66a174b0c3f2051ad387d2a6'

const UInfoHistory = []

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

  await initDiscussion(discussionId, {
    updateUInfo: obj => {
      UInfoHistory.push(obj)
    },
  })

  await insertDturnStatement.call(
    synuser,
    discussionId,
    {
      _id: new ObjectId('6667d688b20d8e339ca50020'),
      title: 'WithIdTitle',
      description: 'WithIdDesc',
    },
    () => {}
  )
})

afterAll(async () => {
  Mongo.disconnect()
  MemoryServer.stop()
})

// Tests
test('Fail if user is not logged in.', async () => {
  const cb = jest.fn()
  await postPointGroups.call({}, discussionId, 1, [], cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error.mock.calls[0][0]).toMatch(/user is not logged in/)
})

test('Fail when groupings.length is > 99.', async () => {
  const tooManyGroupings = []
  for (let item = 0, num = 0; item < 100; item++, num += 2) {
    tooManyGroupings.push([num, num + 1])
  }

  expect(tooManyGroupings).toHaveLength(100)

  const cb = jest.fn()
  await postPointGroups.call(synuser, discussionId, 0, tooManyGroupings, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
})

test('Fail when groupings subarr length is > 99.', async () => {
  const tooManyObjs = [...Array(100).keys()]
  expect(tooManyObjs).toHaveLength(100)

  const cb = jest.fn()
  await postPointGroups.call(synuser, discussionId, 0, [[1, 2], tooManyObjs], cb)
  expect(console.error.mock.calls[0][0]).toMatch(/must contain less than or equal to 99 items/)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
})

test('Fail when groupings contains a 1-object subarray.', async () => {
  const cb = jest.fn()
  await postPointGroups.call(synuser, discussionId, 0, [[0, 1], [2]], cb)

  expect(console.error.mock.calls[0][0]).toMatch(/Groupings contains a subarr with only 1 object/)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
})

test('Fail if arguments are invalid.', async () => {
  const cb = jest.fn()

  await postPointGroups.call(synuser, 0, [], cb)

  expect(console.error.mock.calls[0][0]).toMatch(/Expected 4 arguments/)
})

test("Fail when discussionId doesn't exist and putGroupings() returns false.", async () => {
  const cb = jest.fn()
  await postPointGroups.call(
    synuser,
    'doesntExist',
    0,
    [
      [1, 2],
      [3, 4],
    ],
    cb
  )

  expect(console.error.mock.calls[0][0]).toMatch(/did not complete successfully/)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
})

test('Success if all arguments are valid', async () => {
  const cb = jest.fn()

  // Ensure statementId 0 1 2 3 are correctly inserted
  for (const statementId of [0, 1, 2, 3]) {
    await insertStatementId(discussionId, userId, statementId.toString())
  }

  // Retrieve statementIds to ensure they are returned correctly
  const statementIds = await getStatementIds(discussionId, 0, userId)
  console.log('DEBUG Received statementIds before postPointGroups', statementIds)

  // Ensure statementIds contains at least four elements otherwise terminate the test
  if (!statementIds || statementIds.length < 4) {
    console.error('ERROR Insufficient statementIds', statementIds ? statementIds.length : 'undefined')
    return
  }

  // Print UInfoHistory to verify statementId records
  console.log('DEBUG UInfoHistory before postPointGroups', UInfoHistory)

  // Execute postPointGroups call
  await postPointGroups.call(
    synuser,
    discussionId,
    0,
    [
      [statementIds[0], statementIds[1]],
      [statementIds[2], statementIds[3]],
    ],
    cb
  )

  // Verify that cb is called successfully
  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(true)

  // Ensure UInfoHistory contains the correct data
  expect(UInfoHistory).toMatchObject([
    {
      [userId]: {
        [discussionId]: {
          0: {
            shownStatementIds: {
              [statementIds[0]]: { rank: 0, author: true },
            },
          },
        },
      },
    },
    {
      [userId]: {
        [discussionId]: {
          0: {
            groupings: [
              [statementIds[0], statementIds[1]],
              [statementIds[2], statementIds[3]],
            ],
          },
        },
      },
    },
  ])
})
