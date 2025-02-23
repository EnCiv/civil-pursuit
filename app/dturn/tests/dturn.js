// https://github.com/EnCiv/civil-pursuit/issues/171

const { insertStatementId, getStatementIds, putGroupings, rankMostImportant, initDiscussion, Discussions } = require('../dturn')

describe('dturn.js functions', () => {
  // Reset Discussions before each test to ensure a clean state
  beforeEach(async () => {
    Object.keys(Discussions).forEach(key => delete Discussions[key])

    await initDiscussion('testDiscussion', {
      updates: jest.fn(), // Mock updates function
      updateUInfo: jest.fn(), // Mock updateUInfo function
    })
  })

  // Testing the insertStatementId function
  describe('insertStatementId', () => {
    test('should return undefined if the discussion does not exist', async () => {
      // If the discussionId does not exist, insertStatementId should return undefined
      const result = await insertStatementId('invalid-discussion', 'user1', 'stmt1')
      expect(result).toBeUndefined()
    })

    test('should allow new users to join by adding a statement', async () => {
      // Ensure a user can join by submitting a statement, even if they are new
      const discussionId = 'test-discussion'
      const userId = 'newUser'
      const statementId = 'stmt1'

      Discussions[discussionId] = {
        ShownStatements: { 0: [] }, // Ensure round 0 exists
        Uitems: {}, // No userId exists yet
        updates: jest.fn(),
        updateUInfo: jest.fn(),
      }

      const result = await insertStatementId(discussionId, userId, statementId)

      // Validate that the statement has been successfully inserted
      expect(result).toBe(statementId)
      expect(Discussions[discussionId].Uitems[userId]).toBeDefined() // User should be created
      expect(Discussions[discussionId].ShownStatements[0]).toContainEqual({ statementId, shownCount: 0, rank: 0 })
    })
  })

  // Testing the getStatementIds function
  describe('getStatementIds', () => {
    test('should return statement IDs for a user in a discussion', async () => {
      // Ensures that a user can receive a list of statement IDs they are assigned to evaluate
      const discussionId = 'test-discussion'
      const userId = 'user1'

      // Setting up the discussion with a few statements and the user’s assigned statements
      Discussions[discussionId] = {
        ShownStatements: [
          [
            { statementId: 'stmt1', shownCount: 0, rank: 0 },
            { statementId: 'stmt2', shownCount: 0, rank: 0 },
            { statementId: 'stmt3', shownCount: 0, rank: 0 },
          ],
        ],
        Uitems: { [userId]: { 0: { shownStatementIds: { stmt1: {}, stmt2: {}, stmt3: {} } } } },
        group_size: 2, // Set group size
        updateUInfo: jest.fn(),
      }

      const result = await getStatementIds(discussionId, 0, userId)
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThanOrEqual(2)
      expect(result).toContain('stmt1')
      expect(result).toContain('stmt2')
    })

    test('should return undefined if the user is not part of the discussion', async () => {
      // If the user is not part of the discussion, they should not receive statement IDs
      const discussionId = 'test-discussion'
      Discussions[discussionId] = {
        ShownStatements: [[{ statementId: 'stmt1', shownCount: 0, rank: 0 }]],
        Uitems: {}, // No users exist
      }

      const result = await getStatementIds(discussionId, 0, 'nonexistentUser')
      expect(result).toBeUndefined()
    })
  })

  // Testing the putGroupings function
  describe('putGroupings', () => {
    test('should throw an error if statement IDs were not shown to the user', async () => {
      // Ensures that a user cannot group statements they have not seen
      const discussionId = 'test-discussion'
      const userId = 'user1'

      Discussions[discussionId] = {
        Uitems: { [userId]: { 0: { shownStatementIds: { stmt1: {} } } } },
        updateUInfo: jest.fn(),
      }

      await expect(putGroupings(discussionId, 0, userId, [['stmt2']])).rejects.toThrow('Statement stmt2 was not shown to user user1 in round 0')
    })
  })

  // Testing the rankMostImportant function
  describe('rankMostImportant', () => {
    test('should return undefined if the discussion is not initialized', async () => {
      // If the discussion does not exist, ranking a statement should return undefined
      const result = await rankMostImportant('invalid-discussion', 0, 'user1', 'stmt1', 1)
      expect(result).toBeUndefined()
    })

    test('should return undefined if the user has not participated in the round', async () => {
      // Ensures that if a user has not engaged in a round, they cannot rank statements
      const discussionId = 'test-discussion'
      const userId = 'user1'

      Discussions[discussionId] = { Uitems: {}, updateUInfo: jest.fn() }

      const result = await rankMostImportant(discussionId, 0, userId, 'stmt1', 1)
      expect(result).toBeUndefined()
    })

    test('should correctly update ranking for a shown statement', async () => {
      // Ensures that ranking a statement correctly updates its rank value
      const discussionId = 'test-discussion'
      const userId = 'user1'
      const statementId = 'stmt1'

      // Properly initializing Discussions structure
      Discussions[discussionId] = {
        ShownStatements: [[{ statementId: 'stmt1', shownCount: 0, rank: 0 }]], // Ensure statementId exists
        Uitems: {
          [userId]: {
            0: {
              shownStatementIds: { [statementId]: { rank: 0 } },
            },
          },
        },
        updateUInfo: jest.fn(async update => {
          Object.keys(update).forEach(uid => {
            Object.keys(update[uid]).forEach(did => {
              Object.keys(update[uid][did]).forEach(round => {
                Object.keys(update[uid][did][round].shownStatementIds).forEach(stmt => {
                  Discussions[did].Uitems[uid][round].shownStatementIds[stmt].rank = update[uid][did][round].shownStatementIds[stmt].rank
                })
              })
            })
          })
        }),
      }

      await rankMostImportant(discussionId, 0, userId, statementId, 1)

      // Validate that ranking was successfully applied
      expect(Discussions[discussionId].Uitems[userId][0]).toBeDefined()
      expect(Discussions[discussionId].Uitems[userId][0].shownStatementIds[statementId].rank).toBe(1)
    })
  })
})
