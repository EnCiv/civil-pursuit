// https://github.com/EnCiv/civil-pursuit/issues/154
const { initDiscussion, insertStatementId, getStatementIds, Discussions } = require('../dturn')

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

describe('Add and Retrieve 10 Statements', () => {
  test('Can add 10 statements to a discussion, with group size of 10', async () => {
    await initDiscussion(DISCUSSION_ID, OPTIONS)
    const props = []
    for (let i = 0; i < 20; i++) {
      props.push([DISCUSSION_ID, `user${i}`, `statement${i}`])
    }
    for await (const args of props) {
      await insertStatementId(...args)
    }

    const statements = await getStatementIds(DISCUSSION_ID, 0, USER_ID)

    expect(statements).toBeDefined()
    expect(statements.length).toBe(10)
  })
})

describe('Add and Retrieve 10 Statements not randomly', () => {
  test('Can add 10 statements to a discussion, with group size of 10', async () => {
    await initDiscussion(DISCUSSION_ID, OPTIONS)
    const props = []
    for (let i = 0; i < 20; i++) {
      props.push([DISCUSSION_ID, `user${i}`, `statement${i}`])
    }
    for await (const args of props) {
      await insertStatementId(...args)
    }
    process.env.JEST_TEST_ENV = 'true'

    const statements = await getStatementIds(DISCUSSION_ID, 0, USER_ID)

    expect(statements).toBeDefined()
    expect(statements.length).toBe(10)
  })
})
