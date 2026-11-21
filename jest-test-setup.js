import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongo } from '@enciv/mongo-collections'
import { ObjectId } from 'mongodb'

if (!global.TextEncoder) global.TextEncoder = TextEncoder
if (!global.TextDecoder) global.TextDecoder = TextDecoder

global.startMongoTestServer = async () => {
  const memoryServer = await MongoMemoryServer.create()
  await Mongo.connect(memoryServer.getUri())
  return memoryServer
}

global.stopMongoTestServer = async memoryServer => {
  await Mongo.disconnect()
  await memoryServer?.stop()
}

global.clearMongoCollections = async collections => {
  await Promise.all(collections.map(collection => collection.deleteMany({})))
}

global.makeTestId = () => new ObjectId()

global.makeTestPoint = (overrides = {}) => ({
  _id: new ObjectId(),
  subject: 'Test Point',
  description: 'Test description',
  ...overrides,
})

global.makeTestRank = (overrides = {}) => ({
  parentId: 'test-point',
  stage: 'post',
  round: 0,
  discussionId: 'test-discussion',
  category: 'most',
  userId: 'test-user',
  ...overrides,
})

global.makeTestJsform = (overrides = {}) => ({
  _id: new ObjectId(),
  userId: 'test-user',
  parentId: 'test-discussion',
  moreDetails: {},
  ...overrides,
})

global.makeTestPoints = (count, overrides = {}) => Array.from({ length: count }, (_, index) =>
  global.makeTestPoint(typeof overrides === 'function' ? overrides(index) : overrides)
)

global.makeTestRanks = (count, overrides = {}) => Array.from({ length: count }, (_, index) =>
  global.makeTestRank(typeof overrides === 'function' ? overrides(index) : overrides)
)