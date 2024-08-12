// https://github.com/EnCiv/civil-pursuit/issues/154
const { Mongo } = require('@enciv/mongo-collections')
const { initDiscussion, insertStatementId, getStatementIds, Discussions } = require('../dturn')
const fs = require('fs')
const path = require('path')

const DISCUSSION_ID = 'testDiscussion'
const USER_ID = 'user1'
const OPTIONS = {
  group_size: 10,
  gmajority: 0.5,
  max_rounds: 10,
  min_shown_count: 6,
  min_rank: 3,
  updateUInfo: () => {},
  getAllUInfo: async () => [],
}

const logFilePath = path.join(__dirname, 'test-log.txt')

function logToFile(content) {
  fs.writeFileSync(logFilePath, content)
}

beforeAll(async () => {
  await Mongo.connect(global.__MONGO_URI__, { useUnifiedTopology: true })
  await initDiscussion(DISCUSSION_ID, OPTIONS)
  for (let i = 0; i < 20; i++) {
    await insertStatementId(DISCUSSION_ID, `user${i}`, `statement${i}`)
  }
  logToFile('Discussion state after insertion:\n' + JSON.stringify(Discussions[DISCUSSION_ID], null, 2))
})

afterAll(() => {
  Mongo.disconnect()
})

describe('Add and Retrieve 10 Statements', () => {
  test('Can add 10 statements to a discussion, with group size of 10', async () => {
    const discussion = Discussions[DISCUSSION_ID]
    logToFile('Discussion state before retrieval:\n' + JSON.stringify(discussion, null, 2))

    const statements = await getStatementIds(DISCUSSION_ID, 0, USER_ID)
    console.log('Retrieved statements:', statements)
    logToFile('Retrieved statements after first retrieval:\n' + JSON.stringify(statements, null, 2))

    expect(statements).toBeDefined()
    expect(statements.length).toBe(10)
  })
})
