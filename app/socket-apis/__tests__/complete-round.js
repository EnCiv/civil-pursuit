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

beforeAll(() => {
  process.env.JEST_TEST_ENV = true // don't randomize so tests are repeatable
})

afterAll(() => {
  process.env.JEST_TEST_ENV = undefined // don't randomize so tests are repeatable
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
      UInfoHistory.push(structuredClone(obj))
    },
  })

  let cb
  const cbDone = new Promise((ok, ko) => {
    cb = res => {
      ok(res)
    }
  })

  // Insert statements
  for (let i = 1; i < 20; i++) {
    const statementId = `5f${i.toString(16).padStart(14, '0')}`
    const userId = `6e${i.toString(16).padStart(14, '0')}`
    await insertStatementId(discussionId, userId, statementId)
  }

  // Get statement IDs
  await insertStatementId(discussionId, userId, '5f000000000000ff')
  const statementIds = await getStatementIds(discussionId, 0, userId)

  // Rank the statements
  const idRanks = [{ [statementIds[1]]: 1 }, { [statementIds[2]]: 1 }]
  completeRound.call(synuser, discussionId, 0, idRanks, cb)
  const result = await cbDone

  // Verify that callback function cb was called correctly
  expect(result).toBe(true)

  expect(UInfoHistory).toMatchObject([
    {
      '6e00000000000001': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e00000000000001',
            shownStatementIds: {
              '5f00000000000001': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e00000000000002': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e00000000000002',
            shownStatementIds: {
              '5f00000000000002': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e00000000000003': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e00000000000003',
            shownStatementIds: {
              '5f00000000000003': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e00000000000004': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e00000000000004',
            shownStatementIds: {
              '5f00000000000004': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e00000000000005': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e00000000000005',
            shownStatementIds: {
              '5f00000000000005': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e00000000000006': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e00000000000006',
            shownStatementIds: {
              '5f00000000000006': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e00000000000007': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e00000000000007',
            shownStatementIds: {
              '5f00000000000007': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e00000000000008': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e00000000000008',
            shownStatementIds: {
              '5f00000000000008': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e00000000000009': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e00000000000009',
            shownStatementIds: {
              '5f00000000000009': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e0000000000000a': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e0000000000000a',
            shownStatementIds: {
              '5f0000000000000a': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e0000000000000b': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e0000000000000b',
            shownStatementIds: {
              '5f0000000000000b': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e0000000000000c': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e0000000000000c',
            shownStatementIds: {
              '5f0000000000000c': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e0000000000000d': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e0000000000000d',
            shownStatementIds: {
              '5f0000000000000d': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e0000000000000e': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e0000000000000e',
            shownStatementIds: {
              '5f0000000000000e': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e0000000000000f': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e0000000000000f',
            shownStatementIds: {
              '5f0000000000000f': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e00000000000010': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e00000000000010',
            shownStatementIds: {
              '5f00000000000010': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e00000000000011': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e00000000000011',
            shownStatementIds: {
              '5f00000000000011': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e00000000000012': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e00000000000012',
            shownStatementIds: {
              '5f00000000000012': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '6e00000000000013': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '6e00000000000013',
            shownStatementIds: {
              '5f00000000000013': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '7b4c3a5e8d1f2b9c': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '7b4c3a5e8d1f2b9c',
            shownStatementIds: {
              '5f000000000000ff': {
                rank: 0,
                author: true,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '7b4c3a5e8d1f2b9c': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '7b4c3a5e8d1f2b9c',
            shownStatementIds: {
              '5f000000000000ff': {
                rank: 0,
                author: true,
              },
              '5f00000000000001': {
                rank: 0,
              },
              '5f00000000000002': {
                rank: 0,
              },
              '5f00000000000003': {
                rank: 0,
              },
              '5f00000000000004': {
                rank: 0,
              },
              '5f00000000000005': {
                rank: 0,
              },
              '5f00000000000006': {
                rank: 0,
              },
              '5f00000000000007': {
                rank: 0,
              },
              '5f00000000000008': {
                rank: 0,
              },
              '5f00000000000009': {
                rank: 0,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '7b4c3a5e8d1f2b9c': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '7b4c3a5e8d1f2b9c',
            shownStatementIds: {
              '5f000000000000ff': {
                rank: 0,
                author: true,
              },
              '5f00000000000001': {
                rank: 1,
              },
              '5f00000000000002': {
                rank: 0,
              },
              '5f00000000000003': {
                rank: 0,
              },
              '5f00000000000004': {
                rank: 0,
              },
              '5f00000000000005': {
                rank: 0,
              },
              '5f00000000000006': {
                rank: 0,
              },
              '5f00000000000007': {
                rank: 0,
              },
              '5f00000000000008': {
                rank: 0,
              },
              '5f00000000000009': {
                rank: 0,
              },
            },
            groupings: [],
          },
        },
      },
    },
    {
      '7b4c3a5e8d1f2b9c': {
        '5a2d9c3b6e1f8d4a': {
          0: {
            userId: '7b4c3a5e8d1f2b9c',
            shownStatementIds: {
              '5f000000000000ff': {
                rank: 0,
                author: true,
              },
              '5f00000000000001': {
                rank: 1,
              },
              '5f00000000000002': {
                rank: 1,
              },
              '5f00000000000003': {
                rank: 0,
              },
              '5f00000000000004': {
                rank: 0,
              },
              '5f00000000000005': {
                rank: 0,
              },
              '5f00000000000006': {
                rank: 0,
              },
              '5f00000000000007': {
                rank: 0,
              },
              '5f00000000000008': {
                rank: 0,
              },
              '5f00000000000009': {
                rank: 0,
              },
            },
            groupings: [],
          },
        },
      },
    },
  ])
})
