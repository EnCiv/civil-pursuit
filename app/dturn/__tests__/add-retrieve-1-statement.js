const { Mongo } = require('@enciv/mongo-collections')
const { initDiscussion, insertStatementId, getStatementIds, Discussions } = require('../dturn')

const DISCUSSION_ID = 'testDiscussion'
const USER_ID = 'user1'
const STATEMENT_ID = 'statement1'
const OPTIONS = {
  group_size: 10,
  gmajority: 0.5,
  max_rounds: 10,
  min_shown_count: 6,
  min_rank: 3,
  updateUInfo: () => {},
  getAllUInfo: async () => [],
}

beforeAll(async () => {
  await Mongo.connect(global.__MONGO_URI__, { useUnifiedTopology: true })
  await initDiscussion(DISCUSSION_ID, OPTIONS)
})

afterAll(() => {
  Mongo.disconnect()
})

describe('Add and Retrieve 1 Statement', () => {
  test('Can add 1 statement to a discussion', async () => {
    await insertStatementId(DISCUSSION_ID, USER_ID, STATEMENT_ID)
    const discussion = Discussions[DISCUSSION_ID]
    expect(discussion.ShownStatements.length).toBe(1)
  })

  test('Can not get statements from a discussion that does not have enough statements', async () => {
    const statements = await getStatementIds(DISCUSSION_ID, 0, USER_ID)
    expect(statements).toBeUndefined()
  })
})
