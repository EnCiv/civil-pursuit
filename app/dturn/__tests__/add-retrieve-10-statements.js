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

beforeEach(async () => {
  process.env.JEST_TEST_ENV = 'false'
})
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

describe('Add and Retrieve Statements by 36 users, not randomly and ensure all 36 users get 10 statements', () => {
  test('Can add 10 statements to a discussion, with group size of 10, for 36 users', async () => {
    await initDiscussion(DISCUSSION_ID, OPTIONS)
    const userCount = 36 //for all users to get statements, this must be divisible by group_size-1 and 2, and be greater than 2* group_size
    const props = []
    for (let i = 0; i < userCount; i++) {
      props.push([DISCUSSION_ID, `user${i}`, `statement${i}`])
    }
    for await (const args of props) {
      await insertStatementId(...args)
    }
    process.env.JEST_TEST_ENV = 'true'

    const retrieveProps = []
    for (let i = 0; i < userCount; i++) {
      retrieveProps.push(`user${i}`)
    }

    for await (const userId of retrieveProps) {
      const statements = await getStatementIds(DISCUSSION_ID, 0, userId)
      // expect statements to be undefined of have length 10
      console.info(`User ${userId} statements:`, statements)
      expect(statements === undefined || statements.length === 10).toBe(true)
      expect(statements).toBeDefined()
      expect(statements.length).toBe(10)
    }
  })
})

describe('Add and Retrieve Statements by 108 users, randomly and ensure all 108 users get 10 statements', () => {
  test('Can add statements to a discussion, with group size of 10, for 108 users', async () => {
    process.env.JEST_TEST_ENV = 'false'
    const userCount = 108
    await initDiscussion(DISCUSSION_ID, OPTIONS)
    const statementCounts = {}
    const props = []
    for (let i = 0; i < userCount; i++) {
      const s = `statement${i}`
      props.push([DISCUSSION_ID, `user${i}`, s])
      statementCounts[s] = 0
    }
    for await (const args of props) {
      await insertStatementId(...args)
    }

    const retrieveProps = []
    for (let i = 0; i < userCount; i++) {
      retrieveProps.push(`user${i}`)
    }

    for await (const userId of retrieveProps) {
      const statements = await getStatementIds(DISCUSSION_ID, 0, userId)

      expect(statements).toBeDefined()
      expect(statements.length).toBe(10)

      // Each user should see their own statement
      const userIndex = parseInt(userId.replace('user', ''))
      const ownStatement = `statement${userIndex}`
      expect(statements).toContain(ownStatement)

      // Count how many times each statement appears
      statements?.forEach(statement => {
        statementCounts[statement] = (statementCounts[statement] || 0) + 1
      })
    }

    // Each statement should be seen by exactly 10 users
    //console.log('Statement counts across all users:', statementCounts)
    Object.values(statementCounts).forEach(count => {
      expect(count).toBe(10)
    })
  })
})
