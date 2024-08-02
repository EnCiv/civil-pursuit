// https://github.com/EnCiv/civil-pursuit/issues/178

import postPointGroups from '../post-point-groups'
import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'

// Config

const userId = '6667d5a33da5d19ddc304a6b'
const synuser = { synuser: { id: userId } }

const discussionId = '66a174b0c3f2051ad387d2a6'

const UInfoHistory = []

let MemoryServer
beforeAll(async () => {
  MemoryServer = await MongoMemoryServer.create()
  const uri = MemoryServer.getUri()
  await Mongo.connect(uri)

  await initDiscussion(discussionId, {
    updateUInfo: obj => {
      UInfoHistory.push(obj)
    },
  })
})

afterAll(async () => {
  Mongo.disconnect()
  MemoryServer.stop()
})

// Tests
test('Fail when groupings.length is > 99.', async () => {
  const tooManyGroupings = []
  for (let num = 0; num < 300; num += 2) {
    tooManyGroupings.push([num, num + 1])
  }

  const cb = jest.fn()
  await postPointGroups.call(synuser, discussionId, 1, groupings, cb)
})
