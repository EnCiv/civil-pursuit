// https://github.com/EnCiv/civil-pursuit/issues/178

import postPointGroups from '../post-point-groups'
import insertDturnStatement from '../insert-dturn-statement'
import { initDiscussion } from '../../dturn/dturn'

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'

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
      _id: '6667d688b20d8e339ca50020',
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
  expect(typeof console.error.mock.calls[0][0]).toBe('string')

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

  expect(typeof console.error.mock.calls[0][0]).toBe('string')
})

test("Fail when discussionId doesn't exist and putGroupings() returns false.", async () => {
  const cb = jest.fn()
  await postPointGroups.call(
    synuser,
    '66a174b0c3f2051ad387d2a0',
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

test('Success if all arguments are valid.', async () => {
  const cb = jest.fn()
  await postPointGroups.call(
    synuser,
    discussionId,
    0,
    [
      [0, 1],
      [2, 3],
    ],
    cb
  )

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(true)

  expect(UInfoHistory).toMatchObject([
    {
      '6667d5a33da5d19ddc304a6b': {
        '66a174b0c3f2051ad387d2a6': {
          0: {
            shownStatementIds: {
              '6667d688b20d8e339ca50020': {
                rank: 0,
                author: true,
              },
            },
          },
        },
      },
    },
    {
      '6667d5a33da5d19ddc304a6b': {
        '66a174b0c3f2051ad387d2a6': {
          0: {
            groupings: [
              [0, 1],
              [2, 3],
            ],
          },
        },
      },
    },
  ])
})
