// https://github.com/EnCiv/civil-pursuit/issues/212
import { initDiscussion, insertStatementId, getStatementIds } from '../../dturn/dturn'
import completeRound from '../complete-round'

const userId = '7b4c3a5e8d1f2b9c'
const discussionId = '5a2d9c3b6e1f8d4a'
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
  await initDiscussion(discussionId, {
    group_size: 10,
    updateUInfo: obj => {
      UInfoHistory.push(obj)
    },
  })
  const cb = jest.fn()
  await completeRound.call({}, discussionId, 1, [{ id1: 1 }], cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error).toHaveBeenCalledWith('Cannot complete round - user is not logged in.')
})

// Test 2: Discussion not loaded
test('Return undefined if discussion is not loaded (getStatementIds fails).', async () => {
  // Do not call initDiscussion, so discussion is not initialized
  const cb = jest.fn()

  // Call completeRound with an uninitialized discussionId
  await completeRound.call(synuser, discussionId, 1, [{ id1: 1 }], cb)

  // Verify that callback function cb was called once and returned undefined
  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)

  // Verify console.error calls and their messages
  expect(console.error).toHaveBeenCalledTimes(2)
  expect(console.error).toHaveBeenNthCalledWith(1, `No ShownStatements found for discussion ${discussionId}`)
  expect(console.error).toHaveBeenNthCalledWith(2, 'No statements found to rank.')
})

// Test 3: Success case
test('Success: Insert statements and rank them.', async () => {
  await initDiscussion(discussionId, {
    group_size: 10,
    updateUInfo: obj => {
      UInfoHistory.push(obj)
    },
  })
  const cb = jest.fn()

  // Insert statements
  for (let i = 1; i <= 20; i++) {
    const statementId = `5f${i.toString(16).padStart(14, '0')}`
    const userId = `6e${i.toString(16).padStart(14, '0')}`
    await insertStatementId(discussionId, userId, statementId)
  }

  // Get statement IDs
  const userIdForGetStatementIds = 'user1'
  const statementIds = await getStatementIds(discussionId, 0, userIdForGetStatementIds)

  // Rank the statements
  const idRanks = [{ [statementIds[1]]: 1 }, { [statementIds[2]]: 1 }]
  await completeRound.call(synuser, discussionId, 0, idRanks, cb)

  // Verify that callback function cb was called correctly
  expect(cb).toHaveBeenCalledWith(true)

  const expectedEntries = [
    {
      [userId]: {
        [discussionId]: {
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
        [discussionId]: {
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
