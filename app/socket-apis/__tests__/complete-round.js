// https://github.com/EnCiv/civil-pursuit/issues/212
const dturn = require('../../dturn/dturn')
const completeRound = require('../complete-round')
const { insertStatementId, getStatementIds } = dturn

const userId = '12345678abcdefgh'
const synuser = { synuser: { id: userId } }

const UInfoHistory = []

beforeEach(async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  UInfoHistory.length = 0
})

afterEach(() => {
  console.error.mockRestore()
  jest.restoreAllMocks()
})

// Test 1: User not logged in
test('Return undefined if user is not logged in.', async () => {
  await dturn.initDiscussion('discussion1', {
    group_size: 10,
    updateUInfo: obj => {
      UInfoHistory.push(obj)
    },
  })
  const cb = jest.fn()
  await completeRound.call({}, 'discussion1', 1, [{ id1: 1 }], cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error).toHaveBeenCalledWith('Cannot complete round - user is not logged in.')
})

// Test 2: Discussion not loaded
test('Return undefined if discussion is not loaded (getStatementIds fails).', async () => {
  // Do not call initDiscussion, so discussion1 is not initialized
  const cb = jest.fn()

  // Call completeRound with an uninitialized discussionId
  await completeRound.call(synuser, 'discussion1', 1, [{ id1: 1 }], cb)

  // Verify that callback function cb was called once and returned undefined
  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)

  // Verify console.error calls and their messages
  expect(console.error).toHaveBeenCalledTimes(2)
  expect(console.error).toHaveBeenNthCalledWith(1, 'No ShownStatements found for discussion discussion1')
  expect(console.error).toHaveBeenNthCalledWith(2, 'No statements found to rank.')
})

// Test 3: Success case
test('Success: Insert statements and rank them.', async () => {
  await dturn.initDiscussion('discussion1', {
    group_size: 10,
    updateUInfo: obj => {
      UInfoHistory.push(obj)
    },
  })
  const cb = jest.fn()

  // Insert statements
  for (let i = 1; i <= 20; i++) {
    const statementId = `statement${i}`
    const userId = `user${i}`
    await insertStatementId('discussion1', userId, statementId)
  }

  // Get statement IDs
  const userIdForGetStatementIds = 'user1'
  const statementIds = await getStatementIds('discussion1', 0, userIdForGetStatementIds)

  // Rank the statements
  const idRanks = [{ [statementIds[1]]: 1 }, { [statementIds[2]]: 1 }]
  await completeRound.call(synuser, 'discussion1', 0, idRanks, cb)

  // Verify that callback function cb was called correctly
  expect(cb).toHaveBeenCalledWith(true)

  const expectedEntries = [
    {
      [userId]: {
        discussion1: {
          0: {
            shownStatementIds: {
              [statementIds[1]]: { rank: 1 },
            },
          },
        },
      },
    },
    {
      [userId]: {
        discussion1: {
          0: {
            shownStatementIds: {
              [statementIds[2]]: { rank: 1 },
            },
          },
        },
      },
    },
  ]

  // Check if UInfoHistory contains each expected entry
  expectedEntries.forEach(expectedEntry => {
    expect(UInfoHistory).toContainEqual(expectedEntry)
  })
})
