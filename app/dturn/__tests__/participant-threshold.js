// https://github.com/EnCiv/civil-pursuit/blob/main/docs/participant-threshold.md
const { initDiscussion, Discussions } = require('../dturn')

const DISCUSSION_ID = 'testDiscussionThreshold'

describe('Participant Threshold', () => {
  afterEach(() => {
    // Clean up after each test
    delete Discussions[DISCUSSION_ID]
  })

  describe('Default threshold behavior', () => {
    test('should default to 2 * group_size - 1 when participantThreshold not specified', async () => {
      const options = {
        group_size: 10,
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      }
      await initDiscussion(DISCUSSION_ID, options)
      const discussion = Discussions[DISCUSSION_ID]

      expect(discussion.participantThreshold).toBe(19) // 2 * 10 - 1
    })

    test('should calculate default threshold with different group_size values', async () => {
      // Test with group_size = 5
      await initDiscussion(DISCUSSION_ID + '_5', {
        group_size: 5,
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      })
      expect(Discussions[DISCUSSION_ID + '_5'].participantThreshold).toBe(9) // 2 * 5 - 1

      // Test with group_size = 7 (default)
      await initDiscussion(DISCUSSION_ID + '_7', {
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      })
      expect(Discussions[DISCUSSION_ID + '_7'].participantThreshold).toBe(13) // 2 * 7 - 1

      // Test with group_size = 15
      await initDiscussion(DISCUSSION_ID + '_15', {
        group_size: 15,
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      })
      expect(Discussions[DISCUSSION_ID + '_15'].participantThreshold).toBe(29) // 2 * 15 - 1

      // Clean up
      delete Discussions[DISCUSSION_ID + '_5']
      delete Discussions[DISCUSSION_ID + '_7']
      delete Discussions[DISCUSSION_ID + '_15']
    })

    test('should use default group_size when not specified', async () => {
      await initDiscussion(DISCUSSION_ID, {
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      })
      const discussion = Discussions[DISCUSSION_ID]

      expect(discussion.group_size).toBe(7) // default
      expect(discussion.participantThreshold).toBe(13) // 2 * 7 - 1
    })
  })

  describe('Custom threshold override', () => {
    test('should use custom participantThreshold when provided', async () => {
      const options = {
        group_size: 10,
        participantThreshold: 15,
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      }
      await initDiscussion(DISCUSSION_ID, options)
      const discussion = Discussions[DISCUSSION_ID]

      expect(discussion.participantThreshold).toBe(15)
      expect(discussion.participantThreshold).not.toBe(19) // not the default
    })

    test('should accept participantThreshold regardless of group_size', async () => {
      // Large threshold with small group_size
      await initDiscussion(DISCUSSION_ID + '_large', {
        group_size: 5,
        participantThreshold: 500,
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      })
      expect(Discussions[DISCUSSION_ID + '_large'].participantThreshold).toBe(500)

      // Small threshold with large group_size
      await initDiscussion(DISCUSSION_ID + '_small', {
        group_size: 20,
        participantThreshold: 3,
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      })
      expect(Discussions[DISCUSSION_ID + '_small'].participantThreshold).toBe(3)

      // Clean up
      delete Discussions[DISCUSSION_ID + '_large']
      delete Discussions[DISCUSSION_ID + '_small']
    })

    test('should handle participantThreshold of zero', async () => {
      const options = {
        group_size: 10,
        participantThreshold: 0,
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      }
      await initDiscussion(DISCUSSION_ID, options)
      const discussion = Discussions[DISCUSSION_ID]

      expect(discussion.participantThreshold).toBe(0)
    })

    test('should handle negative participantThreshold', async () => {
      const options = {
        group_size: 10,
        participantThreshold: -5,
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      }
      await initDiscussion(DISCUSSION_ID, options)
      const discussion = Discussions[DISCUSSION_ID]

      expect(discussion.participantThreshold).toBe(-5)
      // Negative means threshold is always met (participants >= -5 is always true)
    })
  })

  describe('Threshold boundary conditions', () => {
    test('should handle very large thresholds', async () => {
      const options = {
        group_size: 10,
        participantThreshold: 999999,
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      }
      await initDiscussion(DISCUSSION_ID, options)
      const discussion = Discussions[DISCUSSION_ID]

      expect(discussion.participantThreshold).toBe(999999)
    })

    test('should handle threshold equal to group_size', async () => {
      const options = {
        group_size: 10,
        participantThreshold: 10,
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      }
      await initDiscussion(DISCUSSION_ID, options)
      const discussion = Discussions[DISCUSSION_ID]

      expect(discussion.participantThreshold).toBe(10)
    })

    test('should handle threshold less than group_size', async () => {
      const options = {
        group_size: 10,
        participantThreshold: 5,
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      }
      await initDiscussion(DISCUSSION_ID, options)
      const discussion = Discussions[DISCUSSION_ID]

      expect(discussion.participantThreshold).toBe(5)
    })
  })

  describe('Backward compatibility', () => {
    test('should work with minimal options (no threshold specified)', async () => {
      const options = {
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      }
      await initDiscussion(DISCUSSION_ID, options)
      const discussion = Discussions[DISCUSSION_ID]

      // Should use defaults
      expect(discussion.group_size).toBe(7)
      expect(discussion.participantThreshold).toBe(13)
      expect(discussion).toBeDefined()
      expect(discussion.ShownStatements).toEqual([])
      expect(discussion.ShownGroups).toEqual([])
      expect(discussion.Gitems).toEqual([])
      expect(discussion.Uitems).toEqual({})
    })

    test('should work with all original options and no participantThreshold', async () => {
      const options = {
        group_size: 10,
        gmajority: 0.5,
        max_rounds: 10,
        min_shown_count: 6,
        min_rank: 3,
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      }
      await initDiscussion(DISCUSSION_ID, options)
      const discussion = Discussions[DISCUSSION_ID]

      // All original options should be set
      expect(discussion.group_size).toBe(10)
      expect(discussion.gmajority).toBe(0.5)
      expect(discussion.max_rounds).toBe(10)
      expect(discussion.min_shown_count).toBe(6)
      expect(discussion.min_rank).toBe(3)

      // participantThreshold should use default calculation
      expect(discussion.participantThreshold).toBe(19)
    })

    test('should preserve all options when participantThreshold is added', async () => {
      const options = {
        group_size: 10,
        gmajority: 0.5,
        max_rounds: 10,
        min_shown_count: 6,
        min_rank: 3,
        participantThreshold: 25,
        updateUInfo: () => {},
        getAllUInfo: async () => [],
      }
      await initDiscussion(DISCUSSION_ID, options)
      const discussion = Discussions[DISCUSSION_ID]

      // All options including custom threshold should be set
      expect(discussion.group_size).toBe(10)
      expect(discussion.gmajority).toBe(0.5)
      expect(discussion.max_rounds).toBe(10)
      expect(discussion.min_shown_count).toBe(6)
      expect(discussion.min_rank).toBe(3)
      expect(discussion.participantThreshold).toBe(25)
    })
  })

  describe('getStatementIds respects participantThreshold', () => {
    const { getStatementIds, insertStatementId, initUitems } = require('../dturn')

    test('should reject getStatementIds when ShownStatements length is below custom participantThreshold', async () => {
      const customThreshold = 50
      await initDiscussion(DISCUSSION_ID, {
        group_size: 5,
        participantThreshold: customThreshold,
        updateUInfo: async () => {},
        getAllUInfo: async () => [],
      })

      const userId = 'user-123'
      const discussion = Discussions[DISCUSSION_ID]
      discussion.ShownStatements[0] = []

      // Add 30 statement items (below threshold of 50)
      for (let i = 0; i < 30; i++) {
        discussion.ShownStatements[0].push({ statementId: `statement-${i}`, shownCount: 0 })
      }

      // Initialize user but don't insert statement yet
      initUitems(DISCUSSION_ID, userId, 0)

      // Should return undefined because we don't have enough statements
      const result = await getStatementIds(DISCUSSION_ID, 0, userId)
      expect(result).toBeUndefined()
    })

    test('should allow getStatementIds when ShownStatements length meets custom participantThreshold', async () => {
      const customThreshold = 50
      await initDiscussion(DISCUSSION_ID, {
        group_size: 5,
        participantThreshold: customThreshold,
        updateUInfo: async () => {},
        getAllUInfo: async () => [],
      })

      const userId = 'user-123'
      const discussion = Discussions[DISCUSSION_ID]
      discussion.ShownStatements[0] = []

      // Add exactly 50 statement items (meets threshold)
      for (let i = 0; i < 50; i++) {
        discussion.ShownStatements[0].push({ statementId: `statement-${i}`, shownCount: 0 })
      }

      // Insert a statement for this user so they have data
      await insertStatementId(DISCUSSION_ID, 0, userId, 'user-statement-123')

      // Should succeed because we have enough statements
      const result = await getStatementIds(DISCUSSION_ID, 0, userId)
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    test('should use default threshold (2 * group_size - 1) when participantThreshold not set', async () => {
      await initDiscussion(DISCUSSION_ID, {
        group_size: 5, // default threshold will be 2 * 5 - 1 = 9
        updateUInfo: async () => {},
        getAllUInfo: async () => [],
      })

      const userId = 'user-123'
      const discussion = Discussions[DISCUSSION_ID]
      discussion.ShownStatements[0] = []

      // Add only 8 statement items (below default threshold of 9)
      for (let i = 0; i < 8; i++) {
        discussion.ShownStatements[0].push({ statementId: `statement-${i}`, shownCount: 0 })
      }

      // Initialize user
      initUitems(DISCUSSION_ID, userId, 0)

      // Should fail with default threshold
      const resultBefore = await getStatementIds(DISCUSSION_ID, 0, userId)
      expect(resultBefore).toBeUndefined()

      // Add one more statement item to meet threshold
      discussion.ShownStatements[0].push({ statementId: 'statement-8', shownCount: 0 })

      // Insert a statement for this user
      await insertStatementId(DISCUSSION_ID, 0, userId, 'user-statement-123')

      // Should now succeed
      const resultAfter = await getStatementIds(DISCUSSION_ID, 0, userId)
      expect(resultAfter).toBeDefined()
      expect(Array.isArray(resultAfter)).toBe(true)
      expect(resultAfter.length).toBeGreaterThan(0)
    })
  })
})
