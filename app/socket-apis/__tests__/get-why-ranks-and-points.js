// https://github.com/EnCiv/civil-pursuit/issues/207

import getWhyRanksAndPoints from '../get-why-ranks-and-points'
import Points from '../../models/points'
import Ranks from '../../models/ranks'
import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ObjectId } from 'mongodb'
import { expect, test } from '@jest/globals'

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
  await Points.deleteMany({})
  await Ranks.deleteMany({})
})

afterEach(() => {
  console.error.mockRestore()
})

// Config
const discussionId = '66a174b0c3f2051ad387d2a6'
const userId = '6667d5a33da5d19ddc304a6b'
const synuser = { synuser: { id: userId } }
const round = 1
const mostIds = ['67d4a332f3d008dd1a2f5be5', '67d4a332f3d008dd1a2f5be6']
const leastIds = ['67d4a332f3d008dd1a2f5be7']
const smallestIdFirst = (a, b) => (a._id < b._id ? -1 : a._id > b._id ? 1 : 0)

// Test 1: User not logged in
test('Fail if user is not logged in', async () => {
  const cb = jest.fn()
  await getWhyRanksAndPoints.call({}, discussionId, round, mostIds, leastIds, cb)
  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith({ ranks: [], whys: [] })
  expect(console.error).toHaveBeenCalledWith('Cannot retrieve whys - user is not logged in.')
})

// Test 2: No ranks or points found
test('Return empty ranks and points if nothing found', async () => {
  const cb = jest.fn()
  await getWhyRanksAndPoints.call(synuser, discussionId, round, mostIds, leastIds, cb)
  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith({ ranks: [], whys: [] })
})

const makeWhys = (parentId, category) =>
  Array.from({ length: 5 }, (v, i) => i).map(i => ({
    _id: new ObjectId(),
    parentId: parentId,
    userId,
    round,
    subject: `Why ${parentId}-${i}`,
    description: `Description ${i}`,
    category,
  }))

// Test 3: Case where there are 5 why-points for each mostId and leastId
test('Return why-points if they exist for mostIds and leastIds', async () => {
  const cb = jest.fn()

  // Insert 5 why-points for each ID
  const whys = mostIds
    .map(parentId => makeWhys(parentId, 'most'))
    .concat(leastIds.map(parentId => makeWhys(parentId, 'least')))
    .flat()

  await Points.insertMany(whys)

  // Fetch ranks and points
  await getWhyRanksAndPoints.call(synuser, discussionId, round, mostIds, leastIds, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  cb.mock.calls[0][0].whys.sort(smallestIdFirst) // whys will come back in random order so sort to match why's
  expect(cb).toHaveBeenCalledWith({ ranks: [], whys: whys.map(({ userId, ...rest }) => rest) })
})

const makeRanks = (parentId, category) =>
  Array.from({ length: 5 }, (v, i) => i).map(i => ({
    _id: new ObjectId(),
    parentId: parentId,
    userId,
    round,
    rank: i,
    stage: 'why',
    category,
    discussionId,
  }))
// Test 4: Rankings exist for each mostId and leastId
test('Return ranks and points when rankings exist for each ID', async () => {
  const cb = jest.fn()

  // Insert ranks for each mostId and leastId
  const ranks = mostIds
    .map(parentId => makeRanks(parentId, 'most'))
    .concat(leastIds.map(parentId => makeRanks(parentId, 'least')))
    .flat()

  // Insert corresponding why-points
  const whys = mostIds
    .map(parentId => makeWhys(parentId, 'most'))
    .concat(leastIds.map(parentId => makeWhys(parentId, 'least')))
    .flat()

  await Ranks.insertMany(ranks)
  await Points.insertMany(whys)

  // Fetch ranks and points
  await getWhyRanksAndPoints.call(synuser, discussionId, round, mostIds, leastIds, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  cb.mock.calls[0][0].whys.sort(smallestIdFirst) // whys will come back in random order so sort to match why's
  expect(cb).toHaveBeenCalledWith({ ranks: ranks, whys: whys.map(({ userId, ...rest }) => rest) })
})

// Test 5: Rankings exist for one ID but not all
const pointWithWhyRankListListWithRanks = [
  {
    point: { _id: '1', subject: 'subject 1', description: 'describe 1', userId },
    whyRankList: [
      { why: { _id: '2', subject: '1 is less than 2', description: '2 is why because', parentId: '1', category: 'most', userId }, rank: { _id: '60', stage: 'why', category: 'most', parentId: '2', round, userId, discussionId } },
      { why: { _id: '3', subject: '1 is less than 3', description: '3 is why because', parentId: '1', category: 'most', userId }, rank: { _id: '61', stage: 'why', category: 'neutral', parentId: '3', round, userId, discussionId } },
      { why: { _id: '4', subject: '1 is less than 4', description: '4 is why because', parentId: '1', category: 'most', userId }, rank: { _id: '62', stage: 'why', category: 'neutral', parentId: '4', round, userId, discussionId } },
      { why: { _id: '5', subject: '1 is less than 5', description: '5 is why because', parentId: '1', category: 'most', userId }, rank: { _id: '63', stage: 'why', category: 'neutral', parentId: '5', round, userId, discussionId } },
      { why: { _id: '6', subject: '1 is less than 6', description: '6 is why because', parentId: '1', category: 'most', userId }, rank: { _id: '64', stage: 'why', category: 'neutral', parentId: '6', round, userId, discussionId } },
    ],
  },
  {
    point: { _id: '21', subject: 'subject 20', description: 'describe 20' },
    whyRankList: [
      { why: { _id: '22', subject: '21 is greater than 2', description: '2 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '23', subject: '21 is greater than 3', description: '3 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '24', subject: '21 is greater than 4', description: '4 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '25', subject: '21 is greater than 5', description: '5 is why because', parentId: '21', category: 'most' } },
      { why: { _id: '26', subject: '21 is greater than 6', description: '6 is why because', parentId: '21', category: 'most' } },
    ],
  },
  {
    point: { _id: '31', subject: 'subject 30', description: 'describe 30' },
    whyRankList: [
      { why: { _id: '32', subject: '30 is greater than 2', description: '2 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '33', subject: '30 is greater than 3', description: '3 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '34', subject: '30 is greater than 4', description: '4 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '35', subject: '30 is greater than 5', description: '5 is why because', parentId: '31', category: 'most' } },
      { why: { _id: '36', subject: '30 is greater than 6', description: '6 is why because', parentId: '31', category: 'most' } },
    ],
  },
  {
    point: { _id: '41', subject: 'subject 40', description: 'describe 40' },
    whyRankList: [
      { why: { _id: '42', subject: '40 is greater than 2', description: '2 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '43', subject: '40 is greater than 3', description: '3 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '44', subject: '40 is greater than 4', description: '4 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '45', subject: '40 is greater than 5', description: '5 is why because', parentId: '41', category: 'least' } },
      { why: { _id: '46', subject: '40 is greater than 6', description: '6 is why because', parentId: '41', category: 'least' } },
    ],
  },
]
test('Handle partial rankings and return appropriate data', async () => {
  const cb = jest.fn()

  const [points, ranks] = pointWithWhyRankListListWithRanks.reduce(
    ([points, ranks], { point, whyRankList }) => {
      points.push(point)
      whyRankList.forEach(({ why, rank }) => {
        rank && ranks.push(rank)
        why && points.push(why)
      })
      return [points, ranks]
    },
    [[], []]
  )

  await Ranks.insertMany(ranks)
  await Points.insertMany(points)

  let mostIdsTable = {}
  let leastIdsTable = {}
  points.forEach(point => {
    if (point.category === 'most') {
      mostIdsTable[point.parentId] = true
    } else if (point.category === 'least') {
      leastIdsTable[point.parentId] = true
    }
  })
  const mostIds = Object.keys(mostIdsTable)
  const leastIds = Object.keys(leastIdsTable)

  // Fetch ranks and points
  await getWhyRanksAndPoints.call(synuser, discussionId, round, mostIds, leastIds, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  cb.mock.calls[0][0].whys.sort(smallestIdFirst) // whys will come back in random order so sort to match why's
  expect(cb.mock.calls[0][0]).toMatchObject({
    ranks: [
      {
        _id: '60',
        stage: 'why',
        category: 'most',
        parentId: '2',
        round: 1,
        userId: '6667d5a33da5d19ddc304a6b',
        discussionId: '66a174b0c3f2051ad387d2a6',
      },
      {
        _id: '61',
        stage: 'why',
        category: 'neutral',
        parentId: '3',
        round: 1,
        userId: '6667d5a33da5d19ddc304a6b',
        discussionId: '66a174b0c3f2051ad387d2a6',
      },
      {
        _id: '62',
        stage: 'why',
        category: 'neutral',
        parentId: '4',
        round: 1,
        userId: '6667d5a33da5d19ddc304a6b',
        discussionId: '66a174b0c3f2051ad387d2a6',
      },
      {
        _id: '63',
        stage: 'why',
        category: 'neutral',
        parentId: '5',
        round: 1,
        userId: '6667d5a33da5d19ddc304a6b',
        discussionId: '66a174b0c3f2051ad387d2a6',
      },
      {
        _id: '64',
        stage: 'why',
        category: 'neutral',
        parentId: '6',
        round: 1,
        userId: '6667d5a33da5d19ddc304a6b',
        discussionId: '66a174b0c3f2051ad387d2a6',
      },
    ],
    whys: [
      {
        _id: '2',
        subject: '1 is less than 2',
        description: '2 is why because',
        parentId: '1',
        category: 'most',
        userId: '6667d5a33da5d19ddc304a6b',
      },
      {
        _id: '22',
        subject: '21 is greater than 2',
        description: '2 is why because',
        parentId: '21',
        category: 'most',
      },
      {
        _id: '23',
        subject: '21 is greater than 3',
        description: '3 is why because',
        parentId: '21',
        category: 'most',
      },
      {
        _id: '24',
        subject: '21 is greater than 4',
        description: '4 is why because',
        parentId: '21',
        category: 'most',
      },
      {
        _id: '25',
        subject: '21 is greater than 5',
        description: '5 is why because',
        parentId: '21',
        category: 'most',
      },
      {
        _id: '26',
        subject: '21 is greater than 6',
        description: '6 is why because',
        parentId: '21',
        category: 'most',
      },
      {
        _id: '3',
        subject: '1 is less than 3',
        description: '3 is why because',
        parentId: '1',
        category: 'most',
        userId: '6667d5a33da5d19ddc304a6b',
      },
      {
        _id: '32',
        subject: '30 is greater than 2',
        description: '2 is why because',
        parentId: '31',
        category: 'most',
      },
      {
        _id: '33',
        subject: '30 is greater than 3',
        description: '3 is why because',
        parentId: '31',
        category: 'most',
      },
      {
        _id: '34',
        subject: '30 is greater than 4',
        description: '4 is why because',
        parentId: '31',
        category: 'most',
      },
      {
        _id: '35',
        subject: '30 is greater than 5',
        description: '5 is why because',
        parentId: '31',
        category: 'most',
      },
      {
        _id: '36',
        subject: '30 is greater than 6',
        description: '6 is why because',
        parentId: '31',
        category: 'most',
      },
      {
        _id: '4',
        subject: '1 is less than 4',
        description: '4 is why because',
        parentId: '1',
        category: 'most',
        userId: '6667d5a33da5d19ddc304a6b',
      },
      {
        _id: '42',
        subject: '40 is greater than 2',
        description: '2 is why because',
        parentId: '41',
        category: 'least',
      },
      {
        _id: '43',
        subject: '40 is greater than 3',
        description: '3 is why because',
        parentId: '41',
        category: 'least',
      },
      {
        _id: '44',
        subject: '40 is greater than 4',
        description: '4 is why because',
        parentId: '41',
        category: 'least',
      },
      {
        _id: '45',
        subject: '40 is greater than 5',
        description: '5 is why because',
        parentId: '41',
        category: 'least',
      },
      {
        _id: '46',
        subject: '40 is greater than 6',
        description: '6 is why because',
        parentId: '41',
        category: 'least',
      },
      {
        _id: '5',
        subject: '1 is less than 5',
        description: '5 is why because',
        parentId: '1',
        category: 'most',
        userId: '6667d5a33da5d19ddc304a6b',
      },
      {
        _id: '6',
        subject: '1 is less than 6',
        description: '6 is why because',
        parentId: '1',
        category: 'most',
        userId: '6667d5a33da5d19ddc304a6b',
      },
    ],
  })
})
