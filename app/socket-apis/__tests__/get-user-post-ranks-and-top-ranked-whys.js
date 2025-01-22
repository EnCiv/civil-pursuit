// https://github.com/EnCiv/civil-pursuit/issues/208

import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongo } from '@enciv/mongo-collections'
import { ObjectId } from 'mongodb'
import Points from '../../models/points'
import getUserPostRanksAndTopRankedWhys from '../get-user-post-ranks-and-top-ranked-whys'
import Ranks from '../../models/ranks'

let memoryServer
let db

const synuser = { synuser: { id: new ObjectId().toString() } }

beforeAll(async () => {
  memoryServer = await MongoMemoryServer.create()
  const uri = memoryServer.getUri()
  await Mongo.connect(uri)
  db = Mongo.db
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

test('User not logged in', async () => {
  const callback = jest.fn()
  await getUserPostRanksAndTopRankedWhys.call({}, 'discussion1', 1, ['id1', 'id2'], callback)
  expect(callback).toHaveBeenCalledWith(undefined)
  expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/no user logged in/))
})

// parent Ids
const pIds = [
  '677d87e57bd4053fb783dbda',
  '677d885ec1dd20ed2ee661e7',
  '677d8877e76d0e8a1c24d3db',
  '677d888caf6ae82cb8eea4aa',
  '677d88b6a8021697e18bd821',
  '677d88c258543fead03a0476',
  '677d88cb9db29ffb187851a2',
  '677d88d52c6117e22e1b3e57',
  '677d88e01212bb844930db81',
  '677d88eaf056e35cf2f80e56',
]

// why ids
const wIds = [
  '677dabd14318865a969771b8',
  '677dabe4bbf89e246fb5571b',
  '677dabf0a3e2c44b5553ac36',
  '677dac057b7c673cd6ec8fb6',
  '677dac1b8803a748276502f4',
  '677dac2b4f804e7781319e5f',
  '677dac3b7dc9056e72f7f04f',
  '677dac4a10aed31e82dba548',
  '677dac58d7456741b55053a7',
  '677dac659a6a7e83643600e5',
  '677db7ff783bd08c31b39645',
  '677db801febc25e922d2d58c',
  '677db8043b4c2fdbbd477bca',
  '677db806fdf20e22d95d0ef5',
  '677db80ac07eb35455b07878',
  '677db80c92384ffe785647ca',
  '677db80ef4411832c006cc36',
  '677db80f8bd4e35276036823',
  '677db8105cbbab65c84defb4',
  '677db8128cc8f1fea755ca1e',
  '677db81397326beb9de77078',
  '677db81528728908e16c99c0',
  '677db8161e2c9fe805973e00',
  '677db81735a2464ce59c6219',
  '677db81b5b3c03ce0b348ce0',
  '677db81c66638e9a8a464cdb',
  '677db81dc00eee862c2dafc5',
  '677db81e5cb6673f44c89738',
  '677db82065dddba1dc221720',
  '677db821d0c367f0aca56cb3',
]

const rIds = [
  '67805d2b69a13d16f1a35560',
  '67805d35c2ccc21607202c48',
  '67805d3612b2857b9e7e3a51',
  '67805d3739be2093e67850fa',
  '67805d39d08c0ade5a89a69c',
  '67805d3a3f15ac6b1131ec51',
  '67805d3b3039b5910de4779b',
  '67805d3cbcf6c5e7d823a337',
  '67805d3dcbcf9235c497bc5a',
  '67805d3f261d0f45cf5a3c9d',
]

test('10 points in ids, nothing ranked', async () => {
  const callback = jest.fn()
  await getUserPostRanksAndTopRankedWhys.call(synuser, 'discussion1', 1, pIds, callback)

  expect(callback).toHaveBeenCalledWith({ ranks: [], whys: [] })
})

function makeWhy(id, pId, category) {
  return {
    _id: wIds[id],
    parentId: pIds[pId],
    category,
    subject: `Why ${category} for ${pId} for ${id}`,
    userId: '123456',
  }
}

test('5 have 2 why mosts, 2 have why leasts, 1 has 1 why most, 1 has 1 why least – nothing ranked', async () => {
  await Points.insertMany([
    makeWhy(0, 0, 'most'),
    makeWhy(1, 0, 'most'),
    makeWhy(2, 1, 'most'),
    makeWhy(3, 1, 'most'),
    makeWhy(4, 2, 'most'),
    makeWhy(5, 2, 'most'),
    makeWhy(6, 3, 'most'),
    makeWhy(7, 3, 'most'),
    makeWhy(8, 4, 'most'),
    makeWhy(9, 4, 'most'),
    makeWhy(10, 5, 'most'),
    makeWhy(11, 5, 'most'),
    makeWhy(12, 6, 'most'),
    makeWhy(13, 6, 'most'),
    makeWhy(14, 7, 'most'),
    makeWhy(15, 7, 'most'),
    makeWhy(16, 8, 'most'),
    makeWhy(17, 8, 'most'),
    makeWhy(18, 9, 'most'),
    makeWhy(19, 9, 'most'),

    makeWhy(20, 10, 'least'),
    makeWhy(21, 10, 'least'),
    makeWhy(22, 11, 'least'),
    makeWhy(23, 11, 'least'),

    makeWhy(24, 12, 'most'),

    makeWhy(25, 13, 'least'),
  ])

  const callback = jest.fn()
  await getUserPostRanksAndTopRankedWhys.call(synuser, 'discussion1', 1, pIds, callback)

  callback.mock.calls[0][0].whys.sort((a, b) => (a._id < b._id ? -1 : a._id > b._id ? 1 : 0)) // order may vary - that's okay
  expect(callback.mock.calls[0][0]).toMatchObject({
    ranks: [],
    whys: [
      {
        _id: '677dabd14318865a969771b8',
        parentId: '677d87e57bd4053fb783dbda',
        category: 'most',
        subject: 'Why most for 0 for 0',
        rankCount: 1,
      },
      {
        _id: '677dabe4bbf89e246fb5571b',
        parentId: '677d87e57bd4053fb783dbda',
        category: 'most',
        subject: 'Why most for 0 for 1',
        rankCount: 1,
      },
      {
        _id: '677dabf0a3e2c44b5553ac36',
        parentId: '677d885ec1dd20ed2ee661e7',
        category: 'most',
        subject: 'Why most for 1 for 2',
        rankCount: 1,
      },
      {
        _id: '677dac057b7c673cd6ec8fb6',
        parentId: '677d885ec1dd20ed2ee661e7',
        category: 'most',
        subject: 'Why most for 1 for 3',
        rankCount: 1,
      },
      {
        _id: '677dac1b8803a748276502f4',
        parentId: '677d8877e76d0e8a1c24d3db',
        category: 'most',
        subject: 'Why most for 2 for 4',
        rankCount: 1,
      },
      {
        _id: '677dac2b4f804e7781319e5f',
        parentId: '677d8877e76d0e8a1c24d3db',
        category: 'most',
        subject: 'Why most for 2 for 5',
        rankCount: 1,
      },
      {
        _id: '677dac3b7dc9056e72f7f04f',
        parentId: '677d888caf6ae82cb8eea4aa',
        category: 'most',
        subject: 'Why most for 3 for 6',
        rankCount: 1,
      },
      {
        _id: '677dac4a10aed31e82dba548',
        parentId: '677d888caf6ae82cb8eea4aa',
        category: 'most',
        subject: 'Why most for 3 for 7',
        rankCount: 1,
      },
      {
        _id: '677dac58d7456741b55053a7',
        parentId: '677d88b6a8021697e18bd821',
        category: 'most',
        subject: 'Why most for 4 for 8',
        rankCount: 1,
      },
      {
        _id: '677dac659a6a7e83643600e5',
        parentId: '677d88b6a8021697e18bd821',
        category: 'most',
        subject: 'Why most for 4 for 9',
        rankCount: 1,
      },
      {
        _id: '677db7ff783bd08c31b39645',
        parentId: '677d88c258543fead03a0476',
        category: 'most',
        subject: 'Why most for 5 for 10',
        rankCount: 1,
      },
      {
        _id: '677db801febc25e922d2d58c',
        parentId: '677d88c258543fead03a0476',
        category: 'most',
        subject: 'Why most for 5 for 11',
        rankCount: 1,
      },
      {
        _id: '677db8043b4c2fdbbd477bca',
        parentId: '677d88cb9db29ffb187851a2',
        category: 'most',
        subject: 'Why most for 6 for 12',
        rankCount: 1,
      },
      {
        _id: '677db806fdf20e22d95d0ef5',
        parentId: '677d88cb9db29ffb187851a2',
        category: 'most',
        subject: 'Why most for 6 for 13',
        rankCount: 1,
      },
      {
        _id: '677db80ac07eb35455b07878',
        parentId: '677d88d52c6117e22e1b3e57',
        category: 'most',
        subject: 'Why most for 7 for 14',
        rankCount: 1,
      },
      {
        _id: '677db80c92384ffe785647ca',
        parentId: '677d88d52c6117e22e1b3e57',
        category: 'most',
        subject: 'Why most for 7 for 15',
        rankCount: 1,
      },
      {
        _id: '677db80ef4411832c006cc36',
        parentId: '677d88e01212bb844930db81',
        category: 'most',
        subject: 'Why most for 8 for 16',
        rankCount: 1,
      },
      {
        _id: '677db80f8bd4e35276036823',
        parentId: '677d88e01212bb844930db81',
        category: 'most',
        subject: 'Why most for 8 for 17',
        rankCount: 1,
      },
      {
        _id: '677db8105cbbab65c84defb4',
        parentId: '677d88eaf056e35cf2f80e56',
        category: 'most',
        subject: 'Why most for 9 for 18',
        rankCount: 1,
      },
      {
        _id: '677db8128cc8f1fea755ca1e',
        parentId: '677d88eaf056e35cf2f80e56',
        category: 'most',
        subject: 'Why most for 9 for 19',
        rankCount: 1,
      },
    ],
  })
})

function makeRank(id, pId, category) {
  return {
    _id: rIds[id],
    parentId: pIds[pId],
    category,
    stage: 'post',
    discussionId: 'discussion1',
    round: 1,
    userId: '123456',
  }
}
test('Above scenario with 5 ranked, nothing for other 5', async () => {
  const ranks = [makeRank(0, 0, 'most'), makeRank(1, 1, 'most'), makeRank(2, 2, 'most'), makeRank(3, 3, 'most'), makeRank(4, 4, 'most')]

  await Ranks.insertMany(ranks)

  const callback = jest.fn()
  await getUserPostRanksAndTopRankedWhys.call(synuser, 'discussion1', 1, pIds, callback)
  callback.mock.calls[0][0].whys.sort((a, b) => (a._id < b._id ? -1 : a._id > b._id ? 1 : 0)) // order may vary - that's okay
  expect(callback.mock.calls[0][0]).toMatchObject({
    ranks: [
      {
        _id: '67805d2b69a13d16f1a35560',
        parentId: '677d87e57bd4053fb783dbda',
        category: 'most',
        stage: 'post',
        discussionId: 'discussion1',
        round: 1,
      },
      {
        _id: '67805d35c2ccc21607202c48',
        parentId: '677d885ec1dd20ed2ee661e7',
        category: 'most',
        stage: 'post',
        discussionId: 'discussion1',
        round: 1,
      },
      {
        _id: '67805d3612b2857b9e7e3a51',
        parentId: '677d8877e76d0e8a1c24d3db',
        category: 'most',
        stage: 'post',
        discussionId: 'discussion1',
        round: 1,
      },
      {
        _id: '67805d3739be2093e67850fa',
        parentId: '677d888caf6ae82cb8eea4aa',
        category: 'most',
        stage: 'post',
        discussionId: 'discussion1',
        round: 1,
      },
      {
        _id: '67805d39d08c0ade5a89a69c',
        parentId: '677d88b6a8021697e18bd821',
        category: 'most',
        stage: 'post',
        discussionId: 'discussion1',
        round: 1,
      },
    ],
    whys: [
      {
        _id: '677dabd14318865a969771b8',
        parentId: '677d87e57bd4053fb783dbda',
        category: 'most',
        subject: 'Why most for 0 for 0',
        rankCount: 1,
      },
      {
        _id: '677dabe4bbf89e246fb5571b',
        parentId: '677d87e57bd4053fb783dbda',
        category: 'most',
        subject: 'Why most for 0 for 1',
        rankCount: 1,
      },
      {
        _id: '677dabf0a3e2c44b5553ac36',
        parentId: '677d885ec1dd20ed2ee661e7',
        category: 'most',
        subject: 'Why most for 1 for 2',
        rankCount: 1,
      },
      {
        _id: '677dac057b7c673cd6ec8fb6',
        parentId: '677d885ec1dd20ed2ee661e7',
        category: 'most',
        subject: 'Why most for 1 for 3',
        rankCount: 1,
      },
      {
        _id: '677dac1b8803a748276502f4',
        parentId: '677d8877e76d0e8a1c24d3db',
        category: 'most',
        subject: 'Why most for 2 for 4',
        rankCount: 1,
      },
      {
        _id: '677dac2b4f804e7781319e5f',
        parentId: '677d8877e76d0e8a1c24d3db',
        category: 'most',
        subject: 'Why most for 2 for 5',
        rankCount: 1,
      },
      {
        _id: '677dac3b7dc9056e72f7f04f',
        parentId: '677d888caf6ae82cb8eea4aa',
        category: 'most',
        subject: 'Why most for 3 for 6',
        rankCount: 1,
      },
      {
        _id: '677dac4a10aed31e82dba548',
        parentId: '677d888caf6ae82cb8eea4aa',
        category: 'most',
        subject: 'Why most for 3 for 7',
        rankCount: 1,
      },
      {
        _id: '677dac58d7456741b55053a7',
        parentId: '677d88b6a8021697e18bd821',
        category: 'most',
        subject: 'Why most for 4 for 8',
        rankCount: 1,
      },
      {
        _id: '677dac659a6a7e83643600e5',
        parentId: '677d88b6a8021697e18bd821',
        category: 'most',
        subject: 'Why most for 4 for 9',
        rankCount: 1,
      },
      {
        _id: '677db7ff783bd08c31b39645',
        parentId: '677d88c258543fead03a0476',
        category: 'most',
        subject: 'Why most for 5 for 10',
        rankCount: 1,
      },
      {
        _id: '677db801febc25e922d2d58c',
        parentId: '677d88c258543fead03a0476',
        category: 'most',
        subject: 'Why most for 5 for 11',
        rankCount: 1,
      },
      {
        _id: '677db8043b4c2fdbbd477bca',
        parentId: '677d88cb9db29ffb187851a2',
        category: 'most',
        subject: 'Why most for 6 for 12',
        rankCount: 1,
      },
      {
        _id: '677db806fdf20e22d95d0ef5',
        parentId: '677d88cb9db29ffb187851a2',
        category: 'most',
        subject: 'Why most for 6 for 13',
        rankCount: 1,
      },
      {
        _id: '677db80ac07eb35455b07878',
        parentId: '677d88d52c6117e22e1b3e57',
        category: 'most',
        subject: 'Why most for 7 for 14',
        rankCount: 1,
      },
      {
        _id: '677db80c92384ffe785647ca',
        parentId: '677d88d52c6117e22e1b3e57',
        category: 'most',
        subject: 'Why most for 7 for 15',
        rankCount: 1,
      },
      {
        _id: '677db80ef4411832c006cc36',
        parentId: '677d88e01212bb844930db81',
        category: 'most',
        subject: 'Why most for 8 for 16',
        rankCount: 1,
      },
      {
        _id: '677db80f8bd4e35276036823',
        parentId: '677d88e01212bb844930db81',
        category: 'most',
        subject: 'Why most for 8 for 17',
        rankCount: 1,
      },
      {
        _id: '677db8105cbbab65c84defb4',
        parentId: '677d88eaf056e35cf2f80e56',
        category: 'most',
        subject: 'Why most for 9 for 18',
        rankCount: 1,
      },
      {
        _id: '677db8128cc8f1fea755ca1e',
        parentId: '677d88eaf056e35cf2f80e56',
        category: 'most',
        subject: 'Why most for 9 for 19',
        rankCount: 1,
      },
    ],
  })
})

test('Above scenario with all ranked', async () => {
  const ranks = [makeRank(5, 5, 'most'), makeRank(6, 6, 'most'), makeRank(7, 7, 'most'), makeRank(8, 8, 'most'), makeRank(9, 9, 'most')]

  await Ranks.insertMany(ranks)

  const callback = jest.fn()
  await getUserPostRanksAndTopRankedWhys.call(synuser, 'discussion1', 1, pIds, callback)
  callback.mock.calls[0][0].whys.sort((a, b) => (a._id < b._id ? -1 : a._id > b._id ? 1 : 0)) // order may vary - that's okay
  expect(callback.mock.calls[0][0]).toMatchObject({
    ranks: [
      {
        _id: '67805d2b69a13d16f1a35560',
        parentId: '677d87e57bd4053fb783dbda',
        category: 'most',
        stage: 'post',
        discussionId: 'discussion1',
        round: 1,
      },
      {
        _id: '67805d35c2ccc21607202c48',
        parentId: '677d885ec1dd20ed2ee661e7',
        category: 'most',
        stage: 'post',
        discussionId: 'discussion1',
        round: 1,
      },
      {
        _id: '67805d3612b2857b9e7e3a51',
        parentId: '677d8877e76d0e8a1c24d3db',
        category: 'most',
        stage: 'post',
        discussionId: 'discussion1',
        round: 1,
      },
      {
        _id: '67805d3739be2093e67850fa',
        parentId: '677d888caf6ae82cb8eea4aa',
        category: 'most',
        stage: 'post',
        discussionId: 'discussion1',
        round: 1,
      },
      {
        _id: '67805d39d08c0ade5a89a69c',
        parentId: '677d88b6a8021697e18bd821',
        category: 'most',
        stage: 'post',
        discussionId: 'discussion1',
        round: 1,
      },
      {
        _id: '67805d3a3f15ac6b1131ec51',
        category: 'most',
        discussionId: 'discussion1',
        parentId: '677d88c258543fead03a0476',
        round: 1,
        stage: 'post',
      },
      {
        _id: '67805d3b3039b5910de4779b',
        category: 'most',
        discussionId: 'discussion1',
        parentId: '677d88cb9db29ffb187851a2',
        round: 1,
        stage: 'post',
      },
      {
        _id: '67805d3cbcf6c5e7d823a337',
        category: 'most',
        discussionId: 'discussion1',
        parentId: '677d88d52c6117e22e1b3e57',
        round: 1,
        stage: 'post',
      },
      {
        _id: '67805d3dcbcf9235c497bc5a',
        category: 'most',
        discussionId: 'discussion1',
        parentId: '677d88e01212bb844930db81',
        round: 1,
        stage: 'post',
      },
      {
        _id: '67805d3f261d0f45cf5a3c9d',
        category: 'most',
        discussionId: 'discussion1',
        parentId: '677d88eaf056e35cf2f80e56',
        round: 1,
        stage: 'post',
      },
    ],
    whys: [
      {
        _id: '677dabd14318865a969771b8',
        parentId: '677d87e57bd4053fb783dbda',
        category: 'most',
        subject: 'Why most for 0 for 0',
        rankCount: 1,
      },
      {
        _id: '677dabe4bbf89e246fb5571b',
        parentId: '677d87e57bd4053fb783dbda',
        category: 'most',
        subject: 'Why most for 0 for 1',
        rankCount: 1,
      },
      {
        _id: '677dabf0a3e2c44b5553ac36',
        parentId: '677d885ec1dd20ed2ee661e7',
        category: 'most',
        subject: 'Why most for 1 for 2',
        rankCount: 1,
      },
      {
        _id: '677dac057b7c673cd6ec8fb6',
        parentId: '677d885ec1dd20ed2ee661e7',
        category: 'most',
        subject: 'Why most for 1 for 3',
        rankCount: 1,
      },
      {
        _id: '677dac1b8803a748276502f4',
        parentId: '677d8877e76d0e8a1c24d3db',
        category: 'most',
        subject: 'Why most for 2 for 4',
        rankCount: 1,
      },
      {
        _id: '677dac2b4f804e7781319e5f',
        parentId: '677d8877e76d0e8a1c24d3db',
        category: 'most',
        subject: 'Why most for 2 for 5',
        rankCount: 1,
      },
      {
        _id: '677dac3b7dc9056e72f7f04f',
        parentId: '677d888caf6ae82cb8eea4aa',
        category: 'most',
        subject: 'Why most for 3 for 6',
        rankCount: 1,
      },
      {
        _id: '677dac4a10aed31e82dba548',
        parentId: '677d888caf6ae82cb8eea4aa',
        category: 'most',
        subject: 'Why most for 3 for 7',
        rankCount: 1,
      },
      {
        _id: '677dac58d7456741b55053a7',
        parentId: '677d88b6a8021697e18bd821',
        category: 'most',
        subject: 'Why most for 4 for 8',
        rankCount: 1,
      },
      {
        _id: '677dac659a6a7e83643600e5',
        parentId: '677d88b6a8021697e18bd821',
        category: 'most',
        subject: 'Why most for 4 for 9',
        rankCount: 1,
      },
      {
        _id: '677db7ff783bd08c31b39645',
        parentId: '677d88c258543fead03a0476',
        category: 'most',
        subject: 'Why most for 5 for 10',
        rankCount: 1,
      },
      {
        _id: '677db801febc25e922d2d58c',
        parentId: '677d88c258543fead03a0476',
        category: 'most',
        subject: 'Why most for 5 for 11',
        rankCount: 1,
      },
      {
        _id: '677db8043b4c2fdbbd477bca',
        parentId: '677d88cb9db29ffb187851a2',
        category: 'most',
        subject: 'Why most for 6 for 12',
        rankCount: 1,
      },
      {
        _id: '677db806fdf20e22d95d0ef5',
        parentId: '677d88cb9db29ffb187851a2',
        category: 'most',
        subject: 'Why most for 6 for 13',
        rankCount: 1,
      },
      {
        _id: '677db80ac07eb35455b07878',
        parentId: '677d88d52c6117e22e1b3e57',
        category: 'most',
        subject: 'Why most for 7 for 14',
        rankCount: 1,
      },
      {
        _id: '677db80c92384ffe785647ca',
        parentId: '677d88d52c6117e22e1b3e57',
        category: 'most',
        subject: 'Why most for 7 for 15',
        rankCount: 1,
      },
      {
        _id: '677db80ef4411832c006cc36',
        parentId: '677d88e01212bb844930db81',
        category: 'most',
        subject: 'Why most for 8 for 16',
        rankCount: 1,
      },
      {
        _id: '677db80f8bd4e35276036823',
        parentId: '677d88e01212bb844930db81',
        category: 'most',
        subject: 'Why most for 8 for 17',
        rankCount: 1,
      },
      {
        _id: '677db8105cbbab65c84defb4',
        parentId: '677d88eaf056e35cf2f80e56',
        category: 'most',
        subject: 'Why most for 9 for 18',
        rankCount: 1,
      },
      {
        _id: '677db8128cc8f1fea755ca1e',
        parentId: '677d88eaf056e35cf2f80e56',
        category: 'most',
        subject: 'Why most for 9 for 19',
        rankCount: 1,
      },
    ],
  })
})
