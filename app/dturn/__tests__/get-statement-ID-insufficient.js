// https://github.com/EnCiv/civil-pursuit/issues/154
const { Mongo } = require('@enciv/mongo-collections')
const { initDiscussion, getStatementIds } = require('../dturn')

const DISCUSSION_ID = 'testDiscussion'
const USER1 = 'user1'

beforeAll(async () => {
  await Mongo.connect(global.__MONGO_URI__, { useUnifiedTopology: true })
  await initDiscussion(DISCUSSION_ID)
})

afterAll(() => {
  Mongo.disconnect()
})

describe('Get Statements', () => {
  test('Cannot get statements from a discussion that does not have enough statements', async () => {
    const statements = await getStatementIds(DISCUSSION_ID, 0, USER1)
    expect(statements).toBeUndefined()
  })
})
