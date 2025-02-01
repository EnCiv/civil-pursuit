// https://github.com/EnCiv/civil-pursuit/issues/171

const { insertStatementId, getStatementIds, putGroupings, rankMostImportant, Discussions } = require('../dturn');

describe('dturn.js functions', () => {
  beforeEach(() => {
    // Reset Discussions before each test
    Object.keys(Discussions).forEach(key => delete Discussions[key]);

    // Initialize the test discussion with necessary functions
    Discussions.testDiscussion = {
      ShownStatements: [],
      Uitems: {},
      updates: jest.fn(),  // Ensure updates function exists
      updateUInfo: jest.fn(),
    };
  });

  // Tests for insertStatementId
  describe('insertStatementId', () => {
    test('should return undefined if discussion does not exist', async () => {
      const result = await insertStatementId('invalid-discussion', 'user1', 'stmt1');
      expect(result).toBeUndefined();
    });

    test('should add a statement when discussion and user exist', async () => {
      const discussionId = 'test-discussion';
      const userId = 'user1';
      const statementId = 'stmt1';
      Discussions[discussionId] = { ShownStatements: [], Uitems: { [userId]: {} }, updates: jest.fn(), updateUInfo: jest.fn() };

      const result = await insertStatementId(discussionId, userId, statementId);
      expect(result).toBe(statementId);
      expect(Discussions[discussionId].ShownStatements[0]).toContainEqual({ statementId, shownCount: 0, rank: 0 });
    });
  });

  // Tests for getStatementIds
  describe('getStatementIds', () => {
    test('should return statement IDs for a user in a discussion', async () => {
      const discussionId = 'test-discussion';
      const userId = 'user1';
      Discussions[discussionId] = {
        ShownStatements: [
          [
            { statementId: 'stmt1', shownCount: 0, rank: 0 },
            { statementId: 'stmt2', shownCount: 0, rank: 0 },
            { statementId: 'stmt3', shownCount: 0, rank: 0 },
          ],
        ],
        Uitems: { [userId]: { 0: { shownStatementIds: { stmt1: {}, stmt2: {}, stmt3: {} } } } },
        group_size: 2,  // Set group_size
        updateUInfo: jest.fn(),
      };

      const result = await getStatementIds(discussionId, 0, userId);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result).toContain('stmt1');
      expect(result).toContain('stmt2');
    });

    test('should return undefined if user is not part of the discussion', async () => {
      const discussionId = 'test-discussion';
      Discussions[discussionId] = {
        ShownStatements: [[{ statementId: 'stmt1', shownCount: 0, rank: 0 }]],
        Uitems: {},
      };

      const result = await getStatementIds(discussionId, 0, 'nonexistentUser');
      expect(result).toBeUndefined();
    });
  });

  // Tests for putGroupings
  describe('putGroupings', () => {
    test('should throw an error if statement IDs were not shown to the user', async () => {
      const discussionId = 'test-discussion';
      const userId = 'user1';
      Discussions[discussionId] = {
        Uitems: { [userId]: { 0: { shownStatementIds: { stmt1: {} } } } },
        updateUInfo: jest.fn(),
      };

      await expect(putGroupings(discussionId, 0, userId, [['stmt2']])).rejects.toThrow(
        'Statement stmt2 was not shown to user user1 in round 0'
      );
    });
  });

  // Tests for rankMostImportant
  describe('rankMostImportant', () => {
    test('should return undefined if discussion is not initialized', async () => {
      const result = await rankMostImportant('invalid-discussion', 0, 'user1', 'stmt1', 1);
      expect(result).toBeUndefined();
    });

    test('should return undefined if user has not participated in round', async () => {
      const discussionId = 'test-discussion';
      const userId = 'user1';
      Discussions[discussionId] = { Uitems: {}, updateUInfo: jest.fn() };

      const result = await rankMostImportant(discussionId, 0, userId, 'stmt1', 1);
      expect(result).toBeUndefined();
    });

    test('should correctly update ranking for a shown statement', async () => {
      const discussionId = 'test-discussion';
      const userId = 'user1';
      const statementId = 'stmt1';

      // Properly initialize Discussions structure
      Discussions[discussionId] = {
        ShownStatements: [[{ statementId: 'stmt1', shownCount: 0, rank: 0 }]],  // Ensure statementId exists
        Uitems: {
          [userId]: {
            0: {
              shownStatementIds: { [statementId]: { rank: 0 } } } } },
        updateUInfo: jest.fn(async (update) => {
          Object.keys(update).forEach(uid => {
            Object.keys(update[uid]).forEach(did => {
              Object.keys(update[uid][did]).forEach(round => {
                Object.keys(update[uid][did][round].shownStatementIds).forEach(stmt => {
                  Discussions[did].Uitems[uid][round].shownStatementIds[stmt].rank = update[uid][did][round].shownStatementIds[stmt].rank;
                });
              });
            });
          });
        }),
      };

      await rankMostImportant(discussionId, 0, userId, statementId, 1);
      expect(Discussions[discussionId].Uitems[userId][0]).toBeDefined();
      expect(Discussions[discussionId].Uitems[userId][0].shownStatementIds[statementId].rank).toBe(1);
    });
  });
});
