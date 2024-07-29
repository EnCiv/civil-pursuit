const { Mongo } = require('@enciv/mongo-collections')
const { initDiscussion, insertStatementId } = require('../dturn')

const DISCUSSION_ID = 'testDiscussion'
const USER1 = 'user1'

beforeAll(async () => {
  await Mongo.connect(global.__MONGO_URI__, { useUnifiedTopology: true })
  await initDiscussion(DISCUSSION_ID)
})

afterAll(() => {
  Mongo.disconnect()
})

describe('Add Statement', () => {
  test('Can add 1 statement to a discussion', () => {
    const statementId = 'statement1'
    const result = insertStatementId(DISCUSSION_ID, USER1, statementId)
    expect(result).toBe(statementId)
    const discussion = require('../dturn').Discussions[DISCUSSION_ID]
    expect(discussion.ShownStatements[0].length).toBe(1)
  })
})
