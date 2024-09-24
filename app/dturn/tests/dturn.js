// https://github.com/EnCiv/civil-pursuit/issues/171

const { initDiscussion } = require('../dturn')

import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'

// Config
const DISCUSSION_ID = 1
const nonexistentOptionErrorRegex = /'a_nonexistent_option' is not an option for initDiscussion()/

let MemoryServer

beforeAll(async () => {
  MemoryServer = await MongoMemoryServer.create()
  const uri = MemoryServer.getUri()
  await Mongo.connect(uri)
})

afterAll(async () => {
  Mongo.disconnect()
  MemoryServer.stop()
})

// Tests
test('Succeed if all options are valid.', async () => {
  initDiscussion(DISCUSSION_ID, { group_size: 15 })
})

test('Fail if all options are not valid.', async () => {
  const func = async () => {
    await initDiscussion(DISCUSSION_ID, { a_nonexistent_option: 12345 })
  }
  expect(func()).rejects.toThrow(nonexistentOptionErrorRegex)
})

test('Fail if at least 1 option is not valid.', async () => {
  const func = async () => {
    await initDiscussion(DISCUSSION_ID, { group_size: 10, a_nonexistent_option: 12345 })
  }
  expect(func()).rejects.toThrow(nonexistentOptionErrorRegex)
})
