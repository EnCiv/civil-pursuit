// https://github.com/EnCiv/civil-pursuit/issues/212
const dturn = require('../../dturn/dturn')
const completeRound = require('../complete-round')
const { Discussions, insertStatementId, getStatementIds } = dturn

const userId = '12345678abcdefgh'
const synuser = { synuser: { id: userId } }

beforeEach(async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})

  Discussions['discussion1'] = {
    ShownStatements: [],
    ShownGroups: [],
    Gitems: [],
    Uitems: {},
    group_size: 10,
    updateUInfo: jest.fn(),
  }
})

afterEach(() => {
  console.error.mockRestore()
  jest.restoreAllMocks()
})

// Test 1: User not logged in
test('Return undefined if user is not logged in.', async () => {
  const cb = jest.fn()
  await completeRound.call({}, 'discussion1', 1, [{ id1: 1 }], cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error).toHaveBeenCalledWith('Cannot complete round - user is not logged in.')
})

// Test 2: Discussion not loaded (getStatementIds throws an error)
test('Return undefined if discussion is not loaded (getStatementIds fails).', async () => {
  const cb = jest.fn()

  // Use jest.spyOn to mock getStatementIds function, making it return a rejected Promise
  jest.spyOn(dturn, 'getStatementIds').mockRejectedValue(new Error('getStatementIds failed'))

  // Call completeRound, using .call to bind this to synuser
  await completeRound.call(synuser, 'discussion1', 1, [{ 1: 1 }], cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
  expect(console.error).toHaveBeenCalledWith('Failed to retrieve statementIds for completeRound.')
})

// Test 3: Success case
test('Success: Insert statements and rank them.', async () => {
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

  // Use jest.spyOn to monitor rankMostImportant function
  const mockRankMostImportant = jest.spyOn(dturn, 'rankMostImportant').mockResolvedValue()

  // Rank the statements
  const idRanks = [{ statement1: 1 }, { statement2: 2 }]

  await completeRound.call(synuser, 'discussion1', 0, idRanks, cb)

  // Verify that mockRankMostImportant was called correctly
  expect(mockRankMostImportant).toHaveBeenCalledWith('discussion1', 0, userId, 'statement1', 1)
  expect(mockRankMostImportant).toHaveBeenCalledWith('discussion1', 0, userId, 'statement2', 2)

  // Verify that callback function cb was called correctly
  expect(cb).toHaveBeenCalledWith(true)
})
