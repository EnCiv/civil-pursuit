// https://github.com/EnCiv/civil-pursuit/issues/305

import getConclusion from '../get-conclusion'
import { Mongo } from '@enciv/mongo-collections'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { initDiscussion, insertStatementId, Discussions } from '../../dturn/dturn'
import upsertPoint from '../../socket-apis/upsert-point'
import upsertRank from '../../socket-apis/upsert-rank'
import Points from '../../models/points'

const ObjectID = require('bson-objectid')

let MemoryServer

const DISCUSSION_ID = '101'
const DISCUSSION_ID2 = '1'

const userId = '6667d5a33da5d19ddc304a6b'
const synuser = { synuser: { id: userId } }

beforeEach(async () => {
  jest.spyOn(console, 'error').mockImplementation(err => {})
})

afterEach(async () => {
  console.error.mockRestore()
})

beforeAll(async () => {
  MemoryServer = await MongoMemoryServer.create()
  const uri = MemoryServer.getUri()
  await Mongo.connect(uri)

  initDiscussion(DISCUSSION_ID, {
    group_size: 5,
    gmajority: 0.7,
    max_rounds: 10,
    min_shown_count: 3,
    min_rank: 3,
    updateUInfo: () => {},
    getAllUInfo: async () => {
      const Uinfos = Object.keys(getTestUInfo()).map(uId => {
        const rounds = getTestUInfo()[uId][DISCUSSION_ID]
        return { [uId]: { [DISCUSSION_ID]: rounds } }
      })
      console.info('Uinfos.length', Uinfos.length)
      return Uinfos
    },
  })
})

afterAll(async () => {
  await Mongo.disconnect()
  await MemoryServer.stop()
})

test('Fail if discussionId not provided', async () => {
  const cb = jest.fn()

  await getConclusion.call({}, undefined, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)
})

test('Fail if conclusion not available/discussion not complete.', async () => {
  const cb = jest.fn()

  const statement = {
    _id: ObjectID().toString(),
    subject: 'proxy random number',
    description: 'desc 1',
    userId: synuser.id,
  }

  await insertStatementId(DISCUSSION_ID, synuser.id, statement._id)

  await getConclusion.call({ synuser: synuser }, DISCUSSION_ID, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(undefined)

  expect(console.error.mock.calls[console.error.mock.calls.length - 1][0]).toMatch(/not complete/)
})

test('Return data if discussion is complete.', async () => {
  const cb = jest.fn()

  initDiscussion(DISCUSSION_ID2, {
    group_size: 5,
    gmajority: 0.5,
    max_rounds: 10,
    min_shown_count: 3,
    min_rank: 3,
    updateUInfo: () => {},
    getAllUInfo: async () => {
      const Uinfos = Object.keys(getTestUInfo()).map(uId => {
        const rounds = getTestUInfo()[uId][DISCUSSION_ID2]
        return { [uId]: { [DISCUSSION_ID2]: rounds } }
      })
      console.info('Uinfos.length', Uinfos.length)
      return Uinfos
    },
  })

  // Insert predefined statements
  const testStatements = Object.values(getTestStatements())
  console.log('inserting ', testStatements.length, ' statements')

  for (let statement of testStatements) {
    statement.description = statement.description.toString()
    await upsertPoint.call({ synuser: { id: statement.userId } }, statement, () => {})
  }

  // Structure and insert predefined uInfo
  const testUInfo = Object.values(getTestUInfo())
  console.log('inserting ', testStatements.length, ' uInfo (may take awhile)')

  for (let UInfoData of testUInfo) {
    const allRounds = UInfoData[DISCUSSION_ID2]

    for (let round of Object.keys(allRounds)) {
      const { userId, ...roundData } = allRounds[round]
      //await Dturns.upsert(userId, DISCUSSION_ID2, round, roundData)

      const shownStatementIds = roundData['shownStatementIds']
      for (let statementId in shownStatementIds) {
        if (shownStatementIds[statementId]['rank'] == 1) {
          const rankData = { parentId: statementId, stage: 'post', round: round, discussionId: DISCUSSION_ID2, category: 'most', userId: userId }
          await upsertRank.call({ synuser: { id: userId } }, rankData, res => {})
        }
      }
    }
  }

  await getConclusion.call({ synuser: synuser }, DISCUSSION_ID2, cb)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith([{ leasts: [], mosts: [], point: { _id: '6864611dda8eca6f38256713', description: '1.5870962407368285', subject: 'proxy random number', userId: '6864611dda8eca6f38256712' } }])
}, 70000)

function getTestUInfo() {
  return {
    '6864611dda8eca6f38256662': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256662',
          shownStatementIds: {
            '6864611dda8eca6f38256663': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256707': {
              rank: 0,
            },
            '6864611dda8eca6f38256757': {
              rank: 0,
            },
            '6864611dda8eca6f382566eb': {
              rank: 0,
            },
            '6864611dda8eca6f382566fd': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256662',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256662',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256664': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256664',
          shownStatementIds: {
            '6864611dda8eca6f38256665': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f38256707': {
              rank: 0,
            },
            '6864611dda8eca6f38256757': {
              rank: 0,
            },
            '6864611dda8eca6f382566eb': {
              rank: 0,
            },
            '6864611dda8eca6f382566fd': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256664',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256664',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256666': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256666',
          shownStatementIds: {
            '6864611dda8eca6f38256667': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f38256707': {
              rank: 0,
            },
            '6864611dda8eca6f38256757': {
              rank: 0,
            },
            '6864611dda8eca6f382566eb': {
              rank: 0,
            },
            '6864611dda8eca6f382566fd': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256666',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256666',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256668': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256668',
          shownStatementIds: {
            '6864611dda8eca6f38256669': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825676b': {
              rank: 1,
            },
            '6864611dda8eca6f38256769': {
              rank: 0,
            },
            '6864611dda8eca6f3825671b': {
              rank: 0,
            },
            '6864611dda8eca6f382566ab': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256668',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256668',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825666a': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825666a',
          shownStatementIds: {
            '6864611dda8eca6f3825666b': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825676b': {
              rank: 1,
            },
            '6864611dda8eca6f38256769': {
              rank: 0,
            },
            '6864611dda8eca6f3825671b': {
              rank: 0,
            },
            '6864611dda8eca6f382566ab': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825666a',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825666a',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825666c': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825666c',
          shownStatementIds: {
            '6864611dda8eca6f3825666d': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825676b': {
              rank: 1,
            },
            '6864611dda8eca6f38256769': {
              rank: 0,
            },
            '6864611dda8eca6f3825671b': {
              rank: 0,
            },
            '6864611dda8eca6f382566ab': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825666c',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825666c',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825666e': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825666e',
          shownStatementIds: {
            '6864611dda8eca6f3825666f': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825676b': {
              rank: 1,
            },
            '6864611dda8eca6f38256769': {
              rank: 0,
            },
            '6864611dda8eca6f3825671b': {
              rank: 0,
            },
            '6864611dda8eca6f382566ab': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825666e',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825666e',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256670': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256670',
          shownStatementIds: {
            '6864611dda8eca6f38256671': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825676b': {
              rank: 1,
            },
            '6864611dda8eca6f38256769': {
              rank: 0,
            },
            '6864611dda8eca6f3825671b': {
              rank: 0,
            },
            '6864611dda8eca6f382566ab': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256670',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256670',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256672': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256672',
          shownStatementIds: {
            '6864611dda8eca6f38256673': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256665': {
              rank: 0,
            },
            '6864611dda8eca6f3825666d': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 1,
            },
            '6864611dda8eca6f38256671': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256672',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256672',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256674': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256674',
          shownStatementIds: {
            '6864611dda8eca6f38256675': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256665': {
              rank: 0,
            },
            '6864611dda8eca6f3825666d': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 1,
            },
            '6864611dda8eca6f38256671': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256674',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256674',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256676': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256676',
          shownStatementIds: {
            '6864611dda8eca6f38256677': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256665': {
              rank: 0,
            },
            '6864611dda8eca6f3825666d': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 1,
            },
            '6864611dda8eca6f38256671': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256676',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256676',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256678': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256678',
          shownStatementIds: {
            '6864611dda8eca6f38256679': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256665': {
              rank: 0,
            },
            '6864611dda8eca6f3825666d': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 1,
            },
            '6864611dda8eca6f38256671': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256678',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256678',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825667a': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825667a',
          shownStatementIds: {
            '6864611dda8eca6f3825667b': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256665': {
              rank: 0,
            },
            '6864611dda8eca6f3825666d': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 1,
            },
            '6864611dda8eca6f38256671': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825667a',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825667a',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825667c': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825667c',
          shownStatementIds: {
            '6864611dda8eca6f3825667d': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256667': {
              rank: 1,
            },
            '6864611dda8eca6f38256673': {
              rank: 0,
            },
            '6864611dda8eca6f3825666b': {
              rank: 0,
            },
            '6864611dda8eca6f3825667b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825667c',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825667c',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825667e': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825667e',
          shownStatementIds: {
            '6864611dda8eca6f3825667f': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256667': {
              rank: 1,
            },
            '6864611dda8eca6f38256673': {
              rank: 0,
            },
            '6864611dda8eca6f3825666b': {
              rank: 0,
            },
            '6864611dda8eca6f3825667b': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f3825667f', '6864611dda8eca6f3825667b']],
        },
        1: {
          userId: '6864611dda8eca6f3825667e',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825667e',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256680': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256680',
          shownStatementIds: {
            '6864611dda8eca6f38256681': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256667': {
              rank: 1,
            },
            '6864611dda8eca6f38256673': {
              rank: 0,
            },
            '6864611dda8eca6f3825666b': {
              rank: 0,
            },
            '6864611dda8eca6f3825667b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256680',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256680',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256682': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256682',
          shownStatementIds: {
            '6864611dda8eca6f38256683': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256673': {
              rank: 0,
            },
            '6864611dda8eca6f3825666b': {
              rank: 0,
            },
            '6864611dda8eca6f3825667b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256682',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256682',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256684': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256684',
          shownStatementIds: {
            '6864611dda8eca6f38256685': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256667': {
              rank: 1,
            },
            '6864611dda8eca6f38256673': {
              rank: 0,
            },
            '6864611dda8eca6f3825666b': {
              rank: 0,
            },
            '6864611dda8eca6f3825667b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256684',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256684',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256686': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256686',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f3825667f': {
              rank: 0,
            },
            '6864611dda8eca6f3825667d': {
              rank: 0,
            },
            '6864611dda8eca6f38256681': {
              rank: 0,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256686',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256686',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256688': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256688',
          shownStatementIds: {
            '6864611dda8eca6f38256689': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825667f': {
              rank: 0,
            },
            '6864611dda8eca6f3825667d': {
              rank: 0,
            },
            '6864611dda8eca6f38256681': {
              rank: 0,
            },
            '6864611dda8eca6f3825666f': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256688',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256688',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825668a': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825668a',
          shownStatementIds: {
            '6864611dda8eca6f3825668b': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825667f': {
              rank: 0,
            },
            '6864611dda8eca6f3825667d': {
              rank: 0,
            },
            '6864611dda8eca6f38256681': {
              rank: 0,
            },
            '6864611dda8eca6f3825666f': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825668a',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825668a',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825668c': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825668c',
          shownStatementIds: {
            '6864611dda8eca6f3825668d': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825667f': {
              rank: 0,
            },
            '6864611dda8eca6f3825667d': {
              rank: 0,
            },
            '6864611dda8eca6f38256681': {
              rank: 0,
            },
            '6864611dda8eca6f3825666f': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825668c',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825668c',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825668e': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825668e',
          shownStatementIds: {
            '6864611dda8eca6f3825668f': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825667f': {
              rank: 0,
            },
            '6864611dda8eca6f3825667d': {
              rank: 0,
            },
            '6864611dda8eca6f38256681': {
              rank: 0,
            },
            '6864611dda8eca6f3825666f': {
              rank: 1,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256690': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256690',
          shownStatementIds: {
            '6864611dda8eca6f38256691': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256683': {
              rank: 1,
            },
            '6864611dda8eca6f3825668f': {
              rank: 0,
            },
            '6864611dda8eca6f38256663': {
              rank: 0,
            },
            '6864611dda8eca6f3825668b': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256692': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256692',
          shownStatementIds: {
            '6864611dda8eca6f38256693': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256683': {
              rank: 1,
            },
            '6864611dda8eca6f3825668f': {
              rank: 0,
            },
            '6864611dda8eca6f38256663': {
              rank: 0,
            },
            '6864611dda8eca6f3825668b': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256694': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256694',
          shownStatementIds: {
            '6864611dda8eca6f38256695': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256683': {
              rank: 1,
            },
            '6864611dda8eca6f3825668f': {
              rank: 0,
            },
            '6864611dda8eca6f38256663': {
              rank: 0,
            },
            '6864611dda8eca6f3825668b': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256696': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256696',
          shownStatementIds: {
            '6864611dda8eca6f38256697': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256683': {
              rank: 1,
            },
            '6864611dda8eca6f3825668f': {
              rank: 0,
            },
            '6864611dda8eca6f38256663': {
              rank: 0,
            },
            '6864611dda8eca6f3825668b': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256698': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256698',
          shownStatementIds: {
            '6864611dda8eca6f38256699': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256683': {
              rank: 1,
            },
            '6864611dda8eca6f3825668f': {
              rank: 0,
            },
            '6864611dda8eca6f38256663': {
              rank: 0,
            },
            '6864611dda8eca6f3825668b': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825669a': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825669a',
          shownStatementIds: {
            '6864611dda8eca6f3825669b': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256689': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f38256693': {
              rank: 0,
            },
            '6864611dda8eca6f38256685': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825669a',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f3825669a',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825669c': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825669c',
          shownStatementIds: {
            '6864611dda8eca6f3825669d': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256689': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f38256693': {
              rank: 0,
            },
            '6864611dda8eca6f38256685': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825669c',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f3825669c',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825669e': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825669e',
          shownStatementIds: {
            '6864611dda8eca6f3825669f': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256689': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f38256693': {
              rank: 0,
            },
            '6864611dda8eca6f38256685': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825669e',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f3825669e',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566a0': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566a0',
          shownStatementIds: {
            '6864611dda8eca6f382566a1': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256689': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f38256693': {
              rank: 0,
            },
            '6864611dda8eca6f38256685': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566a0',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566a0',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566a2': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566a2',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256689': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f38256693': {
              rank: 0,
            },
            '6864611dda8eca6f38256685': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566a2',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566a2',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566a4': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566a4',
          shownStatementIds: {
            '6864611dda8eca6f382566a5': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825669b': {
              rank: 0,
            },
            '6864611dda8eca6f38256691': {
              rank: 0,
            },
            '6864611dda8eca6f38256675': {
              rank: 0,
            },
            '6864611dda8eca6f38256699': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566a4',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566a4',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566a6': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566a6',
          shownStatementIds: {
            '6864611dda8eca6f382566a7': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825669b': {
              rank: 0,
            },
            '6864611dda8eca6f38256691': {
              rank: 0,
            },
            '6864611dda8eca6f38256675': {
              rank: 0,
            },
            '6864611dda8eca6f38256699': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566a6',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566a6',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566a8': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566a8',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f3825669b': {
              rank: 0,
            },
            '6864611dda8eca6f38256691': {
              rank: 0,
            },
            '6864611dda8eca6f38256675': {
              rank: 0,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566a8',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566a8',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566aa': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566aa',
          shownStatementIds: {
            '6864611dda8eca6f382566ab': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f3825669b': {
              rank: 0,
            },
            '6864611dda8eca6f38256691': {
              rank: 0,
            },
            '6864611dda8eca6f38256675': {
              rank: 0,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566aa',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566aa',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566ac': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566ac',
          shownStatementIds: {
            '6864611dda8eca6f382566ad': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f3825669b': {
              rank: 0,
            },
            '6864611dda8eca6f38256691': {
              rank: 0,
            },
            '6864611dda8eca6f38256675': {
              rank: 0,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566ac',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566ac',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566ae': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566ae',
          shownStatementIds: {
            '6864611dda8eca6f382566af': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256679': {
              rank: 0,
            },
            '6864611dda8eca6f382566a3': {
              rank: 1,
            },
            '6864611dda8eca6f3825668d': {
              rank: 0,
            },
            '6864611dda8eca6f3825669f': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566ae',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566ae',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566b0': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566b0',
          shownStatementIds: {
            '6864611dda8eca6f382566b1': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256679': {
              rank: 0,
            },
            '6864611dda8eca6f382566a3': {
              rank: 1,
            },
            '6864611dda8eca6f3825668d': {
              rank: 0,
            },
            '6864611dda8eca6f3825669f': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566b0',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566b0',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566b2': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566b2',
          shownStatementIds: {
            '6864611dda8eca6f382566b3': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256679': {
              rank: 0,
            },
            '6864611dda8eca6f382566a3': {
              rank: 1,
            },
            '6864611dda8eca6f3825668d': {
              rank: 0,
            },
            '6864611dda8eca6f3825669f': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566b2',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566b2',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566b4': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566b4',
          shownStatementIds: {
            '6864611dda8eca6f382566b5': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256679': {
              rank: 0,
            },
            '6864611dda8eca6f382566a3': {
              rank: 1,
            },
            '6864611dda8eca6f3825668d': {
              rank: 0,
            },
            '6864611dda8eca6f3825669f': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566b4',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566b4',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566b6': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566b6',
          shownStatementIds: {
            '6864611dda8eca6f382566b7': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256679': {
              rank: 0,
            },
            '6864611dda8eca6f382566a3': {
              rank: 1,
            },
            '6864611dda8eca6f3825668d': {
              rank: 0,
            },
            '6864611dda8eca6f3825669f': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566b6',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566b6',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566b8': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566b8',
          shownStatementIds: {
            '6864611dda8eca6f382566b9': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f382566af': {
              rank: 0,
            },
            '6864611dda8eca6f382566b5': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566b7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566b8',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566b8',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566ba': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566ba',
          shownStatementIds: {
            '6864611dda8eca6f382566bb': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f382566af': {
              rank: 0,
            },
            '6864611dda8eca6f382566b5': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566b7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566ba',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566ba',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566bc': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566bc',
          shownStatementIds: {
            '6864611dda8eca6f382566bd': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566af': {
              rank: 0,
            },
            '6864611dda8eca6f382566b5': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 1,
            },
            '6864611dda8eca6f382566b7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566bc',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566bc',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566be': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566be',
          shownStatementIds: {
            '6864611dda8eca6f382566bf': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f382566af': {
              rank: 0,
            },
            '6864611dda8eca6f382566b5': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566b7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566be',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566be',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566c0': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566c0',
          shownStatementIds: {
            '6864611dda8eca6f382566c1': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566af': {
              rank: 0,
            },
            '6864611dda8eca6f382566b5': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 1,
            },
            '6864611dda8eca6f382566b7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566c0',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566c0',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566c2': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566c2',
          shownStatementIds: {
            '6864611dda8eca6f382566c3': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566a5': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f382566ad': {
              rank: 0,
            },
            '6864611dda8eca6f382566c1': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566c2',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566c2',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566c4': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566c4',
          shownStatementIds: {
            '6864611dda8eca6f382566c5': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566a5': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f382566ad': {
              rank: 0,
            },
            '6864611dda8eca6f382566c1': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566c4',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566c4',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566c6': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566c6',
          shownStatementIds: {
            '6864611dda8eca6f382566c7': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566a5': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f382566ad': {
              rank: 0,
            },
            '6864611dda8eca6f382566c1': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566c6',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566c6',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566c8': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566c8',
          shownStatementIds: {
            '6864611dda8eca6f382566c9': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566a5': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f382566ad': {
              rank: 0,
            },
            '6864611dda8eca6f382566c1': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566c8',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566c8',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566ca': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566ca',
          shownStatementIds: {
            '6864611dda8eca6f382566cb': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566a5': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f382566ad': {
              rank: 0,
            },
            '6864611dda8eca6f382566c1': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566ca',
          shownStatementIds: {
            '6864611dda8eca6f38256687': {
              rank: 1,
            },
            '6864611dda8eca6f3825666f': {
              rank: 0,
            },
            '6864611dda8eca6f38256667': {
              rank: 0,
            },
            '6864611dda8eca6f38256683': {
              rank: 0,
            },
            '6864611dda8eca6f38256669': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256683', '6864611dda8eca6f3825666f']],
        },
        2: {
          userId: '6864611dda8eca6f382566ca',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566cc': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566cc',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f382566c3': {
              rank: 0,
            },
            '6864611dda8eca6f382566cb': {
              rank: 0,
            },
            '6864611dda8eca6f382566c9': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566ce': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566ce',
          shownStatementIds: {
            '6864611dda8eca6f382566cf': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566c3': {
              rank: 0,
            },
            '6864611dda8eca6f382566cb': {
              rank: 0,
            },
            '6864611dda8eca6f382566c9': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 1,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566d0': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566d0',
          shownStatementIds: {
            '6864611dda8eca6f382566d1': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566c3': {
              rank: 0,
            },
            '6864611dda8eca6f382566cb': {
              rank: 0,
            },
            '6864611dda8eca6f382566c9': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566d0',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566d0',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566d2': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566d2',
          shownStatementIds: {
            '6864611dda8eca6f382566d3': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f382566c3': {
              rank: 0,
            },
            '6864611dda8eca6f382566cb': {
              rank: 0,
            },
            '6864611dda8eca6f382566c9': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566d2',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566d2',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566d4': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566d4',
          shownStatementIds: {
            '6864611dda8eca6f382566d5': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566c3': {
              rank: 0,
            },
            '6864611dda8eca6f382566cb': {
              rank: 0,
            },
            '6864611dda8eca6f382566c9': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566d4',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566d4',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566d6': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566d6',
          shownStatementIds: {
            '6864611dda8eca6f382566d7': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256697': {
              rank: 0,
            },
            '6864611dda8eca6f382566d5': {
              rank: 0,
            },
            '6864611dda8eca6f38256695': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566d6',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566d6',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566d8': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566d8',
          shownStatementIds: {
            '6864611dda8eca6f382566d9': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256697': {
              rank: 0,
            },
            '6864611dda8eca6f382566d5': {
              rank: 0,
            },
            '6864611dda8eca6f38256695': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566d8',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566d8',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566da': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566da',
          shownStatementIds: {
            '6864611dda8eca6f382566db': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256697': {
              rank: 0,
            },
            '6864611dda8eca6f382566d5': {
              rank: 0,
            },
            '6864611dda8eca6f38256695': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566da',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566da',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566dc': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566dc',
          shownStatementIds: {
            '6864611dda8eca6f382566dd': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256697': {
              rank: 0,
            },
            '6864611dda8eca6f382566d5': {
              rank: 0,
            },
            '6864611dda8eca6f38256695': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566dc',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566dc',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566de': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566de',
          shownStatementIds: {
            '6864611dda8eca6f382566df': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256697': {
              rank: 0,
            },
            '6864611dda8eca6f382566d5': {
              rank: 0,
            },
            '6864611dda8eca6f38256695': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566de',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566de',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566e0': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566e0',
          shownStatementIds: {
            '6864611dda8eca6f382566e1': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566db': {
              rank: 1,
            },
            '6864611dda8eca6f382566bf': {
              rank: 0,
            },
            '6864611dda8eca6f382566c7': {
              rank: 0,
            },
            '6864611dda8eca6f382566dd': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566e0',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566e0',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566e2': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566e2',
          shownStatementIds: {
            '6864611dda8eca6f382566e3': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566db': {
              rank: 1,
            },
            '6864611dda8eca6f382566bf': {
              rank: 0,
            },
            '6864611dda8eca6f382566c7': {
              rank: 0,
            },
            '6864611dda8eca6f382566dd': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566e2',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566e2',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566e4': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566e4',
          shownStatementIds: {
            '6864611dda8eca6f382566e5': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566db': {
              rank: 1,
            },
            '6864611dda8eca6f382566bf': {
              rank: 0,
            },
            '6864611dda8eca6f382566c7': {
              rank: 0,
            },
            '6864611dda8eca6f382566dd': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566e4',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566e4',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566e6': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566e6',
          shownStatementIds: {
            '6864611dda8eca6f382566e7': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566db': {
              rank: 1,
            },
            '6864611dda8eca6f382566bf': {
              rank: 0,
            },
            '6864611dda8eca6f382566c7': {
              rank: 0,
            },
            '6864611dda8eca6f382566dd': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566e6',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566e6',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566e8': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566e8',
          shownStatementIds: {
            '6864611dda8eca6f382566e9': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566db': {
              rank: 1,
            },
            '6864611dda8eca6f382566bf': {
              rank: 0,
            },
            '6864611dda8eca6f382566c7': {
              rank: 0,
            },
            '6864611dda8eca6f382566dd': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566e8',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566e8',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566ea': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566ea',
          shownStatementIds: {
            '6864611dda8eca6f382566eb': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825669d': {
              rank: 0,
            },
            '6864611dda8eca6f382566e3': {
              rank: 0,
            },
            '6864611dda8eca6f382566e5': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566ea',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566ea',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566ec': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566ec',
          shownStatementIds: {
            '6864611dda8eca6f382566ed': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825669d': {
              rank: 0,
            },
            '6864611dda8eca6f382566e3': {
              rank: 0,
            },
            '6864611dda8eca6f382566e5': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566ec',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566ec',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566ee': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566ee',
          shownStatementIds: {
            '6864611dda8eca6f382566ef': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825669d': {
              rank: 0,
            },
            '6864611dda8eca6f382566e3': {
              rank: 0,
            },
            '6864611dda8eca6f382566e5': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566ee',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566ee',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566f0': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566f0',
          shownStatementIds: {
            '6864611dda8eca6f382566f1': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f3825669d': {
              rank: 0,
            },
            '6864611dda8eca6f382566e3': {
              rank: 0,
            },
            '6864611dda8eca6f382566e5': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566f0',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566f0',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566f2': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566f2',
          shownStatementIds: {
            '6864611dda8eca6f382566f3': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825669d': {
              rank: 0,
            },
            '6864611dda8eca6f382566e3': {
              rank: 0,
            },
            '6864611dda8eca6f382566e5': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566f2',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566f2',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566f4': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566f4',
          shownStatementIds: {
            '6864611dda8eca6f382566f5': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566c5': {
              rank: 0,
            },
            '6864611dda8eca6f382566a1': {
              rank: 0,
            },
            '6864611dda8eca6f382566ef': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566f4',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566f4',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566f6': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566f6',
          shownStatementIds: {
            '6864611dda8eca6f382566f7': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566cd': {
              rank: 1,
            },
            '6864611dda8eca6f382566c5': {
              rank: 0,
            },
            '6864611dda8eca6f382566a1': {
              rank: 0,
            },
            '6864611dda8eca6f382566ef': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566f6',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566f6',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566f8': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566f8',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566c5': {
              rank: 0,
            },
            '6864611dda8eca6f382566a1': {
              rank: 0,
            },
            '6864611dda8eca6f382566ef': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566f8',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566f8',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566fa': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566fa',
          shownStatementIds: {
            '6864611dda8eca6f382566fb': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566cd': {
              rank: 1,
            },
            '6864611dda8eca6f382566c5': {
              rank: 0,
            },
            '6864611dda8eca6f382566a1': {
              rank: 0,
            },
            '6864611dda8eca6f382566ef': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566fa',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566fa',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566fc': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566fc',
          shownStatementIds: {
            '6864611dda8eca6f382566fd': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566c5': {
              rank: 0,
            },
            '6864611dda8eca6f382566a1': {
              rank: 0,
            },
            '6864611dda8eca6f382566ef': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566fc',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566fc',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f382566fe': {
      1: {
        0: {
          userId: '6864611dda8eca6f382566fe',
          shownStatementIds: {
            '6864611dda8eca6f382566ff': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566b9': {
              rank: 0,
            },
            '6864611dda8eca6f382566b3': {
              rank: 0,
            },
            '6864611dda8eca6f382566ed': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f382566fe',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f382566fe',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256700': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256700',
          shownStatementIds: {
            '6864611dda8eca6f38256701': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566b9': {
              rank: 0,
            },
            '6864611dda8eca6f382566b3': {
              rank: 0,
            },
            '6864611dda8eca6f382566ed': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256700',
          shownStatementIds: {
            '6864611dda8eca6f382566a3': {
              rank: 0,
            },
            '6864611dda8eca6f382566bd': {
              rank: 0,
            },
            '6864611dda8eca6f38256677': {
              rank: 0,
            },
            '6864611dda8eca6f382566a9': {
              rank: 1,
            },
            '6864611dda8eca6f38256699': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256700',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256702': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256702',
          shownStatementIds: {
            '6864611dda8eca6f38256703': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566b9': {
              rank: 0,
            },
            '6864611dda8eca6f382566b3': {
              rank: 0,
            },
            '6864611dda8eca6f382566ed': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256702',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256702',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256704': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256704',
          shownStatementIds: {
            '6864611dda8eca6f38256705': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566b9': {
              rank: 0,
            },
            '6864611dda8eca6f382566b3': {
              rank: 0,
            },
            '6864611dda8eca6f382566ed': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256704',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256704',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256706': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256706',
          shownStatementIds: {
            '6864611dda8eca6f38256707': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566b9': {
              rank: 0,
            },
            '6864611dda8eca6f382566b3': {
              rank: 0,
            },
            '6864611dda8eca6f382566ed': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256706',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256706',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256708': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256708',
          shownStatementIds: {
            '6864611dda8eca6f38256709': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f382566f7': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566e7': {
              rank: 0,
            },
            '6864611dda8eca6f382566fb': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256708',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256708',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825670a': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825670a',
          shownStatementIds: {
            '6864611dda8eca6f3825670b': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566f7': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 1,
            },
            '6864611dda8eca6f382566e7': {
              rank: 0,
            },
            '6864611dda8eca6f382566fb': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825670a',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825670a',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825670c': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825670c',
          shownStatementIds: {
            '6864611dda8eca6f3825670d': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566f7': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 1,
            },
            '6864611dda8eca6f382566e7': {
              rank: 0,
            },
            '6864611dda8eca6f382566fb': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825670c',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825670c',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825670e': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825670e',
          shownStatementIds: {
            '6864611dda8eca6f3825670f': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566f7': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 1,
            },
            '6864611dda8eca6f382566e7': {
              rank: 0,
            },
            '6864611dda8eca6f382566fb': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f382566e7', '6864611dda8eca6f3825670f']],
        },
        1: {
          userId: '6864611dda8eca6f3825670e',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825670e',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256710': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256710',
          shownStatementIds: {
            '6864611dda8eca6f38256711': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566f7': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 1,
            },
            '6864611dda8eca6f382566e7': {
              rank: 0,
            },
            '6864611dda8eca6f382566fb': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256710',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256710',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256712': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256712',
          shownStatementIds: {
            '6864611dda8eca6f38256713': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
            '6864611dda8eca6f382566f5': {
              rank: 0,
            },
            '6864611dda8eca6f38256701': {
              rank: 0,
            },
            '6864611dda8eca6f3825670f': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f382566d9', '6864611dda8eca6f382566f5']],
        },
        1: {
          userId: '6864611dda8eca6f38256712',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256712',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256714': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256714',
          shownStatementIds: {
            '6864611dda8eca6f38256715': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
            '6864611dda8eca6f382566f5': {
              rank: 0,
            },
            '6864611dda8eca6f38256701': {
              rank: 0,
            },
            '6864611dda8eca6f3825670f': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f382566d9', '6864611dda8eca6f382566f5']],
        },
        1: {
          userId: '6864611dda8eca6f38256714',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256714',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256716': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256716',
          shownStatementIds: {
            '6864611dda8eca6f38256717': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566d9': {
              rank: 1,
            },
            '6864611dda8eca6f382566f5': {
              rank: 0,
            },
            '6864611dda8eca6f38256701': {
              rank: 0,
            },
            '6864611dda8eca6f3825670f': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f382566d9', '6864611dda8eca6f382566f5']],
        },
        1: {
          userId: '6864611dda8eca6f38256716',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256716',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256718': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256718',
          shownStatementIds: {
            '6864611dda8eca6f38256719': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566d9': {
              rank: 1,
            },
            '6864611dda8eca6f382566f5': {
              rank: 0,
            },
            '6864611dda8eca6f38256701': {
              rank: 0,
            },
            '6864611dda8eca6f3825670f': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f382566d9', '6864611dda8eca6f382566f5']],
        },
        1: {
          userId: '6864611dda8eca6f38256718',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256718',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825671a': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825671a',
          shownStatementIds: {
            '6864611dda8eca6f3825671b': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566d9': {
              rank: 1,
            },
            '6864611dda8eca6f382566f5': {
              rank: 0,
            },
            '6864611dda8eca6f38256701': {
              rank: 0,
            },
            '6864611dda8eca6f3825670f': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f382566d9', '6864611dda8eca6f382566f5']],
        },
        1: {
          userId: '6864611dda8eca6f3825671a',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825671a',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825671c': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825671c',
          shownStatementIds: {
            '6864611dda8eca6f3825671d': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256715': {
              rank: 0,
            },
            '6864611dda8eca6f382566bb': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f3825670d': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825671c',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825671c',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825671e': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825671e',
          shownStatementIds: {
            '6864611dda8eca6f3825671f': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256715': {
              rank: 0,
            },
            '6864611dda8eca6f382566bb': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f3825670d': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825671e',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825671e',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256720': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256720',
          shownStatementIds: {
            '6864611dda8eca6f38256721': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256715': {
              rank: 0,
            },
            '6864611dda8eca6f382566bb': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f3825670d': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256720',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256720',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256722': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256722',
          shownStatementIds: {
            '6864611dda8eca6f38256723': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256715': {
              rank: 0,
            },
            '6864611dda8eca6f382566bb': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f3825670d': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256722',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256722',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256724': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256724',
          shownStatementIds: {
            '6864611dda8eca6f38256725': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256715': {
              rank: 0,
            },
            '6864611dda8eca6f382566bb': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f3825670d': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256724',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256724',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256726': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256726',
          shownStatementIds: {
            '6864611dda8eca6f38256727': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566f3': {
              rank: 1,
            },
            '6864611dda8eca6f382566d1': {
              rank: 0,
            },
            '6864611dda8eca6f382566ff': {
              rank: 0,
            },
            '6864611dda8eca6f38256703': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256726',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256726',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256728': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256728',
          shownStatementIds: {
            '6864611dda8eca6f38256729': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d1': {
              rank: 0,
            },
            '6864611dda8eca6f382566ff': {
              rank: 0,
            },
            '6864611dda8eca6f38256703': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256728',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256728',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825672a': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825672a',
          shownStatementIds: {
            '6864611dda8eca6f3825672b': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566f3': {
              rank: 1,
            },
            '6864611dda8eca6f382566d1': {
              rank: 0,
            },
            '6864611dda8eca6f382566ff': {
              rank: 0,
            },
            '6864611dda8eca6f38256703': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825672a',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825672a',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825672c': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825672c',
          shownStatementIds: {
            '6864611dda8eca6f3825672d': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d1': {
              rank: 0,
            },
            '6864611dda8eca6f382566ff': {
              rank: 0,
            },
            '6864611dda8eca6f38256703': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825672c',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825672c',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825672e': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825672e',
          shownStatementIds: {
            '6864611dda8eca6f3825672f': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566f3': {
              rank: 1,
            },
            '6864611dda8eca6f382566d1': {
              rank: 0,
            },
            '6864611dda8eca6f382566ff': {
              rank: 0,
            },
            '6864611dda8eca6f38256703': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256703', '6864611dda8eca6f3825672f']],
        },
        1: {
          userId: '6864611dda8eca6f3825672e',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825672e',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256730': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256730',
          shownStatementIds: {
            '6864611dda8eca6f38256731': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f38256721': {
              rank: 0,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256719': {
              rank: 0,
            },
            '6864611dda8eca6f38256725': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256730',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256730',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256732': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256732',
          shownStatementIds: {
            '6864611dda8eca6f38256733': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f38256721': {
              rank: 0,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256719': {
              rank: 0,
            },
            '6864611dda8eca6f38256725': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256732',
          shownStatementIds: {
            '6864611dda8eca6f382566cd': {
              rank: 0,
            },
            '6864611dda8eca6f382566d3': {
              rank: 1,
            },
            '6864611dda8eca6f382566db': {
              rank: 0,
            },
            '6864611dda8eca6f382566e9': {
              rank: 0,
            },
            '6864611dda8eca6f382566d7': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256732',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256734': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256734',
          shownStatementIds: {
            '6864611dda8eca6f38256735': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f38256721': {
              rank: 0,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256719': {
              rank: 0,
            },
            '6864611dda8eca6f38256725': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256736': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256736',
          shownStatementIds: {
            '6864611dda8eca6f38256737': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256721': {
              rank: 0,
            },
            '6864611dda8eca6f382566cf': {
              rank: 1,
            },
            '6864611dda8eca6f38256719': {
              rank: 0,
            },
            '6864611dda8eca6f38256725': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f38256737', '6864611dda8eca6f38256721']],
        },
      },
    },
    '6864611dda8eca6f38256738': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256738',
          shownStatementIds: {
            '6864611dda8eca6f38256739': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256721': {
              rank: 0,
            },
            '6864611dda8eca6f382566cf': {
              rank: 1,
            },
            '6864611dda8eca6f38256719': {
              rank: 0,
            },
            '6864611dda8eca6f38256725': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256738',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256738',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825673a': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825673a',
          shownStatementIds: {
            '6864611dda8eca6f3825673b': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566b1': {
              rank: 0,
            },
            '6864611dda8eca6f38256727': {
              rank: 0,
            },
            '6864611dda8eca6f38256739': {
              rank: 0,
            },
            '6864611dda8eca6f3825670b': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825673a',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825673a',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825673c': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825673c',
          shownStatementIds: {
            '6864611dda8eca6f3825673d': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566b1': {
              rank: 0,
            },
            '6864611dda8eca6f38256727': {
              rank: 0,
            },
            '6864611dda8eca6f38256739': {
              rank: 0,
            },
            '6864611dda8eca6f3825670b': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825673c',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825673c',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825673e': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825673e',
          shownStatementIds: {
            '6864611dda8eca6f3825673f': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566b1': {
              rank: 0,
            },
            '6864611dda8eca6f38256727': {
              rank: 0,
            },
            '6864611dda8eca6f38256739': {
              rank: 0,
            },
            '6864611dda8eca6f3825670b': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825673e',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825673e',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256740': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256740',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566b1': {
              rank: 0,
            },
            '6864611dda8eca6f38256727': {
              rank: 0,
            },
            '6864611dda8eca6f38256739': {
              rank: 0,
            },
            '6864611dda8eca6f3825670b': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256740',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256740',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256742': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256742',
          shownStatementIds: {
            '6864611dda8eca6f38256743': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f382566b1': {
              rank: 0,
            },
            '6864611dda8eca6f38256727': {
              rank: 0,
            },
            '6864611dda8eca6f38256739': {
              rank: 0,
            },
            '6864611dda8eca6f3825670b': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256742',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256742',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256744': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256744',
          shownStatementIds: {
            '6864611dda8eca6f38256745': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256709': {
              rank: 1,
            },
            '6864611dda8eca6f3825671d': {
              rank: 0,
            },
            '6864611dda8eca6f38256737': {
              rank: 0,
            },
            '6864611dda8eca6f382566f1': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256744',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256744',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256746': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256746',
          shownStatementIds: {
            '6864611dda8eca6f38256747': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256709': {
              rank: 1,
            },
            '6864611dda8eca6f3825671d': {
              rank: 0,
            },
            '6864611dda8eca6f38256737': {
              rank: 0,
            },
            '6864611dda8eca6f382566f1': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256746',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256746',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256748': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256748',
          shownStatementIds: {
            '6864611dda8eca6f38256749': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256709': {
              rank: 1,
            },
            '6864611dda8eca6f3825671d': {
              rank: 0,
            },
            '6864611dda8eca6f38256737': {
              rank: 0,
            },
            '6864611dda8eca6f382566f1': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256748',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256748',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825674a': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825674a',
          shownStatementIds: {
            '6864611dda8eca6f3825674b': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825671d': {
              rank: 0,
            },
            '6864611dda8eca6f38256737': {
              rank: 0,
            },
            '6864611dda8eca6f382566f1': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825674a',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825674a',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825674c': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825674c',
          shownStatementIds: {
            '6864611dda8eca6f3825674d': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256709': {
              rank: 1,
            },
            '6864611dda8eca6f3825671d': {
              rank: 0,
            },
            '6864611dda8eca6f38256737': {
              rank: 0,
            },
            '6864611dda8eca6f382566f1': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825674c',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825674c',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825674e': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825674e',
          shownStatementIds: {
            '6864611dda8eca6f3825674f': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825672b': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 1,
            },
            '6864611dda8eca6f3825671f': {
              rank: 0,
            },
            '6864611dda8eca6f38256717': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f3825672b', '6864611dda8eca6f38256717']],
        },
        1: {
          userId: '6864611dda8eca6f3825674e',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825674e',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256750': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256750',
          shownStatementIds: {
            '6864611dda8eca6f38256751': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825672b': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 1,
            },
            '6864611dda8eca6f3825671f': {
              rank: 0,
            },
            '6864611dda8eca6f38256717': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f3825672b', '6864611dda8eca6f38256717']],
        },
        1: {
          userId: '6864611dda8eca6f38256750',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256750',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256752': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256752',
          shownStatementIds: {
            '6864611dda8eca6f38256753': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825672b': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 1,
            },
            '6864611dda8eca6f3825671f': {
              rank: 0,
            },
            '6864611dda8eca6f38256717': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f3825672b', '6864611dda8eca6f38256717']],
        },
        1: {
          userId: '6864611dda8eca6f38256752',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256752',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256754': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256754',
          shownStatementIds: {
            '6864611dda8eca6f38256755': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825672b': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 1,
            },
            '6864611dda8eca6f3825671f': {
              rank: 0,
            },
            '6864611dda8eca6f38256717': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f3825672b', '6864611dda8eca6f38256717']],
        },
        1: {
          userId: '6864611dda8eca6f38256754',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256754',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256756': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256756',
          shownStatementIds: {
            '6864611dda8eca6f38256757': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825672b': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 1,
            },
            '6864611dda8eca6f3825671f': {
              rank: 0,
            },
            '6864611dda8eca6f38256717': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f3825672b', '6864611dda8eca6f38256717']],
        },
        1: {
          userId: '6864611dda8eca6f38256756',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256756',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256758': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256758',
          shownStatementIds: {
            '6864611dda8eca6f38256759': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566df': {
              rank: 0,
            },
            '6864611dda8eca6f3825673d': {
              rank: 0,
            },
            '6864611dda8eca6f38256747': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256758',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256758',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825675a': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825675a',
          shownStatementIds: {
            '6864611dda8eca6f3825675b': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566df': {
              rank: 0,
            },
            '6864611dda8eca6f3825673d': {
              rank: 0,
            },
            '6864611dda8eca6f38256747': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825675a',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825675a',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825675c': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825675c',
          shownStatementIds: {
            '6864611dda8eca6f3825675d': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566df': {
              rank: 0,
            },
            '6864611dda8eca6f3825673d': {
              rank: 0,
            },
            '6864611dda8eca6f38256747': {
              rank: 0,
            },
          },
          groupings: [['6864611dda8eca6f3825675d', '6864611dda8eca6f38256747']],
        },
        1: {
          userId: '6864611dda8eca6f3825675c',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825675c',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825675e': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825675e',
          shownStatementIds: {
            '6864611dda8eca6f3825675f': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566df': {
              rank: 0,
            },
            '6864611dda8eca6f3825673d': {
              rank: 0,
            },
            '6864611dda8eca6f38256747': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825675e',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825675e',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256760': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256760',
          shownStatementIds: {
            '6864611dda8eca6f38256761': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566df': {
              rank: 0,
            },
            '6864611dda8eca6f3825673d': {
              rank: 0,
            },
            '6864611dda8eca6f38256747': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256760',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256760',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256762': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256762',
          shownStatementIds: {
            '6864611dda8eca6f38256763': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825673f': {
              rank: 0,
            },
            '6864611dda8eca6f3825675f': {
              rank: 0,
            },
            '6864611dda8eca6f38256735': {
              rank: 0,
            },
            '6864611dda8eca6f38256741': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256762',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256762',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256764': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256764',
          shownStatementIds: {
            '6864611dda8eca6f38256765': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825673f': {
              rank: 0,
            },
            '6864611dda8eca6f3825675f': {
              rank: 0,
            },
            '6864611dda8eca6f38256735': {
              rank: 0,
            },
            '6864611dda8eca6f38256741': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256764',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256764',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256766': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256766',
          shownStatementIds: {
            '6864611dda8eca6f38256767': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f3825673f': {
              rank: 0,
            },
            '6864611dda8eca6f3825675f': {
              rank: 0,
            },
            '6864611dda8eca6f38256735': {
              rank: 0,
            },
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256766',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256766',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f38256768': {
      1: {
        0: {
          userId: '6864611dda8eca6f38256768',
          shownStatementIds: {
            '6864611dda8eca6f38256769': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f3825673f': {
              rank: 0,
            },
            '6864611dda8eca6f3825675f': {
              rank: 0,
            },
            '6864611dda8eca6f38256735': {
              rank: 0,
            },
            '6864611dda8eca6f38256741': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f38256768',
          shownStatementIds: {
            '6864611dda8eca6f382566f9': {
              rank: 1,
            },
            '6864611dda8eca6f382566cf': {
              rank: 0,
            },
            '6864611dda8eca6f38256705': {
              rank: 0,
            },
            '6864611dda8eca6f382566f3': {
              rank: 0,
            },
            '6864611dda8eca6f382566d9': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f38256768',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825676a': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825676a',
          shownStatementIds: {
            '6864611dda8eca6f3825676b': {
              rank: 1,
              author: true,
            },
            '6864611dda8eca6f3825673f': {
              rank: 0,
            },
            '6864611dda8eca6f3825675f': {
              rank: 0,
            },
            '6864611dda8eca6f38256735': {
              rank: 0,
            },
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825676a',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825676a',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825676c': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825676c',
          shownStatementIds: {
            '6864611dda8eca6f3825676d': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256707': {
              rank: 0,
            },
            '6864611dda8eca6f38256757': {
              rank: 0,
            },
            '6864611dda8eca6f382566eb': {
              rank: 0,
            },
            '6864611dda8eca6f382566fd': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825676c',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825676c',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
    '6864611dda8eca6f3825676e': {
      1: {
        0: {
          userId: '6864611dda8eca6f3825676e',
          shownStatementIds: {
            '6864611dda8eca6f3825676f': {
              rank: 0,
              author: true,
            },
            '6864611dda8eca6f38256707': {
              rank: 0,
            },
            '6864611dda8eca6f38256757': {
              rank: 0,
            },
            '6864611dda8eca6f382566eb': {
              rank: 0,
            },
            '6864611dda8eca6f382566fd': {
              rank: 1,
            },
          },
          groupings: [],
        },
        1: {
          userId: '6864611dda8eca6f3825676e',
          shownStatementIds: {
            '6864611dda8eca6f38256741': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f3825670b': {
              rank: 0,
            },
            '6864611dda8eca6f38256709': {
              rank: 0,
            },
            '6864611dda8eca6f3825674b': {
              rank: 0,
            },
          },
          groupings: [],
        },
        2: {
          userId: '6864611dda8eca6f3825676e',
          shownStatementIds: {
            '6864611dda8eca6f382566a9': {
              rank: 0,
            },
            '6864611dda8eca6f38256713': {
              rank: 1,
            },
            '6864611dda8eca6f382566d3': {
              rank: 0,
            },
            '6864611dda8eca6f382566f9': {
              rank: 0,
            },
            '6864611dda8eca6f38256687': {
              rank: 0,
            },
          },
          groupings: [],
        },
      },
    },
  }
}

function getTestStatements() {
  return {
    '6864611dda8eca6f38256663': {
      _id: '6864611dda8eca6f38256663',
      subject: 'proxy random number',
      description: 23.501454057484537,
      userId: '6864611dda8eca6f38256662',
    },
    '6864611dda8eca6f38256665': {
      _id: '6864611dda8eca6f38256665',
      subject: 'proxy random number',
      description: 16.64986952229046,
      userId: '6864611dda8eca6f38256664',
    },
    '6864611dda8eca6f38256667': {
      _id: '6864611dda8eca6f38256667',
      subject: 'proxy random number',
      description: 15.086892712877308,
      userId: '6864611dda8eca6f38256666',
    },
    '6864611dda8eca6f38256669': {
      _id: '6864611dda8eca6f38256669',
      subject: 'proxy random number',
      description: 14.203146207415518,
      userId: '6864611dda8eca6f38256668',
    },
    '6864611dda8eca6f3825666b': {
      _id: '6864611dda8eca6f3825666b',
      subject: 'proxy random number',
      description: 80.19894230963055,
      userId: '6864611dda8eca6f3825666a',
    },
    '6864611dda8eca6f3825666d': {
      _id: '6864611dda8eca6f3825666d',
      subject: 'proxy random number',
      description: 57.6093740797333,
      userId: '6864611dda8eca6f3825666c',
    },
    '6864611dda8eca6f3825666f': {
      _id: '6864611dda8eca6f3825666f',
      subject: 'proxy random number',
      description: 13.690156426269938,
      userId: '6864611dda8eca6f3825666e',
    },
    '6864611dda8eca6f38256671': {
      _id: '6864611dda8eca6f38256671',
      subject: 'proxy random number',
      description: 45.156023935162914,
      userId: '6864611dda8eca6f38256670',
    },
    '6864611dda8eca6f38256673': {
      _id: '6864611dda8eca6f38256673',
      subject: 'proxy random number',
      description: 40.998080910940615,
      userId: '6864611dda8eca6f38256672',
    },
    '6864611dda8eca6f38256675': {
      _id: '6864611dda8eca6f38256675',
      subject: 'proxy random number',
      description: 47.43930079883371,
      userId: '6864611dda8eca6f38256674',
    },
    '6864611dda8eca6f38256677': {
      _id: '6864611dda8eca6f38256677',
      subject: 'proxy random number',
      description: 20.450256051619984,
      userId: '6864611dda8eca6f38256676',
    },
    '6864611dda8eca6f38256679': {
      _id: '6864611dda8eca6f38256679',
      subject: 'proxy random number',
      description: 94.74589514153688,
      userId: '6864611dda8eca6f38256678',
    },
    '6864611dda8eca6f3825667b': {
      _id: '6864611dda8eca6f3825667b',
      subject: 'proxy random number',
      description: 74.49462965844096,
      userId: '6864611dda8eca6f3825667a',
    },
    '6864611dda8eca6f3825667d': {
      _id: '6864611dda8eca6f3825667d',
      subject: 'proxy random number',
      description: 50.0965149583545,
      userId: '6864611dda8eca6f3825667c',
    },
    '6864611dda8eca6f3825667f': {
      _id: '6864611dda8eca6f3825667f',
      subject: 'proxy random number',
      description: 74.32730426324933,
      userId: '6864611dda8eca6f3825667e',
    },
    '6864611dda8eca6f38256681': {
      _id: '6864611dda8eca6f38256681',
      subject: 'proxy random number',
      description: 88.70881520076061,
      userId: '6864611dda8eca6f38256680',
    },
    '6864611dda8eca6f38256683': {
      _id: '6864611dda8eca6f38256683',
      subject: 'proxy random number',
      description: 13.264827096598507,
      userId: '6864611dda8eca6f38256682',
    },
    '6864611dda8eca6f38256685': {
      _id: '6864611dda8eca6f38256685',
      subject: 'proxy random number',
      description: 73.3657044896417,
      userId: '6864611dda8eca6f38256684',
    },
    '6864611dda8eca6f38256687': {
      _id: '6864611dda8eca6f38256687',
      subject: 'proxy random number',
      description: 9.849462145679144,
      userId: '6864611dda8eca6f38256686',
    },
    '6864611dda8eca6f38256689': {
      _id: '6864611dda8eca6f38256689',
      subject: 'proxy random number',
      description: 34.450743075465624,
      userId: '6864611dda8eca6f38256688',
    },
    '6864611dda8eca6f3825668b': {
      _id: '6864611dda8eca6f3825668b',
      subject: 'proxy random number',
      description: 70.53099791822264,
      userId: '6864611dda8eca6f3825668a',
    },
    '6864611dda8eca6f3825668d': {
      _id: '6864611dda8eca6f3825668d',
      subject: 'proxy random number',
      description: 66.03403494740805,
      userId: '6864611dda8eca6f3825668c',
    },
    '6864611dda8eca6f3825668f': {
      _id: '6864611dda8eca6f3825668f',
      subject: 'proxy random number',
      description: 81.90569789586752,
      userId: '6864611dda8eca6f3825668e',
    },
    '6864611dda8eca6f38256691': {
      _id: '6864611dda8eca6f38256691',
      subject: 'proxy random number',
      description: 43.0548917165005,
      userId: '6864611dda8eca6f38256690',
    },
    '6864611dda8eca6f38256693': {
      _id: '6864611dda8eca6f38256693',
      subject: 'proxy random number',
      description: 28.734013708879246,
      userId: '6864611dda8eca6f38256692',
    },
    '6864611dda8eca6f38256695': {
      _id: '6864611dda8eca6f38256695',
      subject: 'proxy random number',
      description: 78.73909906382981,
      userId: '6864611dda8eca6f38256694',
    },
    '6864611dda8eca6f38256697': {
      _id: '6864611dda8eca6f38256697',
      subject: 'proxy random number',
      description: 63.03035261436085,
      userId: '6864611dda8eca6f38256696',
    },
    '6864611dda8eca6f38256699': {
      _id: '6864611dda8eca6f38256699',
      subject: 'proxy random number',
      description: 42.939904660601734,
      userId: '6864611dda8eca6f38256698',
    },
    '6864611dda8eca6f3825669b': {
      _id: '6864611dda8eca6f3825669b',
      subject: 'proxy random number',
      description: 87.74272501926256,
      userId: '6864611dda8eca6f3825669a',
    },
    '6864611dda8eca6f3825669d': {
      _id: '6864611dda8eca6f3825669d',
      subject: 'proxy random number',
      description: 87.57906317130252,
      userId: '6864611dda8eca6f3825669c',
    },
    '6864611dda8eca6f3825669f': {
      _id: '6864611dda8eca6f3825669f',
      subject: 'proxy random number',
      description: 54.43531437495932,
      userId: '6864611dda8eca6f3825669e',
    },
    '6864611dda8eca6f382566a1': {
      _id: '6864611dda8eca6f382566a1',
      subject: 'proxy random number',
      description: 72.61446671129939,
      userId: '6864611dda8eca6f382566a0',
    },
    '6864611dda8eca6f382566a3': {
      _id: '6864611dda8eca6f382566a3',
      subject: 'proxy random number',
      description: 30.836350120522216,
      userId: '6864611dda8eca6f382566a2',
    },
    '6864611dda8eca6f382566a5': {
      _id: '6864611dda8eca6f382566a5',
      subject: 'proxy random number',
      description: 79.57460016713758,
      userId: '6864611dda8eca6f382566a4',
    },
    '6864611dda8eca6f382566a7': {
      _id: '6864611dda8eca6f382566a7',
      subject: 'proxy random number',
      description: 81.73534077651547,
      userId: '6864611dda8eca6f382566a6',
    },
    '6864611dda8eca6f382566a9': {
      _id: '6864611dda8eca6f382566a9',
      subject: 'proxy random number',
      description: 17.722612560885032,
      userId: '6864611dda8eca6f382566a8',
    },
    '6864611dda8eca6f382566ab': {
      _id: '6864611dda8eca6f382566ab',
      subject: 'proxy random number',
      description: 39.27877666916591,
      userId: '6864611dda8eca6f382566aa',
    },
    '6864611dda8eca6f382566ad': {
      _id: '6864611dda8eca6f382566ad',
      subject: 'proxy random number',
      description: 21.776873734078993,
      userId: '6864611dda8eca6f382566ac',
    },
    '6864611dda8eca6f382566af': {
      _id: '6864611dda8eca6f382566af',
      subject: 'proxy random number',
      description: 60.55357312834053,
      userId: '6864611dda8eca6f382566ae',
    },
    '6864611dda8eca6f382566b1': {
      _id: '6864611dda8eca6f382566b1',
      subject: 'proxy random number',
      description: 73.85565685702022,
      userId: '6864611dda8eca6f382566b0',
    },
    '6864611dda8eca6f382566b3': {
      _id: '6864611dda8eca6f382566b3',
      subject: 'proxy random number',
      description: 81.09831740099109,
      userId: '6864611dda8eca6f382566b2',
    },
    '6864611dda8eca6f382566b5': {
      _id: '6864611dda8eca6f382566b5',
      subject: 'proxy random number',
      description: 80.71579710086148,
      userId: '6864611dda8eca6f382566b4',
    },
    '6864611dda8eca6f382566b7': {
      _id: '6864611dda8eca6f382566b7',
      subject: 'proxy random number',
      description: 99.17267629800988,
      userId: '6864611dda8eca6f382566b6',
    },
    '6864611dda8eca6f382566b9': {
      _id: '6864611dda8eca6f382566b9',
      subject: 'proxy random number',
      description: 18.963482194395763,
      userId: '6864611dda8eca6f382566b8',
    },
    '6864611dda8eca6f382566bb': {
      _id: '6864611dda8eca6f382566bb',
      subject: 'proxy random number',
      description: 11.621819971032597,
      userId: '6864611dda8eca6f382566ba',
    },
    '6864611dda8eca6f382566bd': {
      _id: '6864611dda8eca6f382566bd',
      subject: 'proxy random number',
      description: 48.9730440017861,
      userId: '6864611dda8eca6f382566bc',
    },
    '6864611dda8eca6f382566bf': {
      _id: '6864611dda8eca6f382566bf',
      subject: 'proxy random number',
      description: 19.185356978805256,
      userId: '6864611dda8eca6f382566be',
    },
    '6864611dda8eca6f382566c1': {
      _id: '6864611dda8eca6f382566c1',
      subject: 'proxy random number',
      description: 97.84567021586528,
      userId: '6864611dda8eca6f382566c0',
    },
    '6864611dda8eca6f382566c3': {
      _id: '6864611dda8eca6f382566c3',
      subject: 'proxy random number',
      description: 55.060474923663506,
      userId: '6864611dda8eca6f382566c2',
    },
    '6864611dda8eca6f382566c5': {
      _id: '6864611dda8eca6f382566c5',
      subject: 'proxy random number',
      description: 85.29963658925006,
      userId: '6864611dda8eca6f382566c4',
    },
    '6864611dda8eca6f382566c7': {
      _id: '6864611dda8eca6f382566c7',
      subject: 'proxy random number',
      description: 85.52713475794809,
      userId: '6864611dda8eca6f382566c6',
    },
    '6864611dda8eca6f382566c9': {
      _id: '6864611dda8eca6f382566c9',
      subject: 'proxy random number',
      description: 73.5044692956881,
      userId: '6864611dda8eca6f382566c8',
    },
    '6864611dda8eca6f382566cb': {
      _id: '6864611dda8eca6f382566cb',
      subject: 'proxy random number',
      description: 75.30025189140534,
      userId: '6864611dda8eca6f382566ca',
    },
    '6864611dda8eca6f382566cd': {
      _id: '6864611dda8eca6f382566cd',
      subject: 'proxy random number',
      description: 33.01070233979344,
      userId: '6864611dda8eca6f382566cc',
    },
    '6864611dda8eca6f382566cf': {
      _id: '6864611dda8eca6f382566cf',
      subject: 'proxy random number',
      description: 68.29941249045683,
      userId: '6864611dda8eca6f382566ce',
    },
    '6864611dda8eca6f382566d1': {
      _id: '6864611dda8eca6f382566d1',
      subject: 'proxy random number',
      description: 79.59972459585485,
      userId: '6864611dda8eca6f382566d0',
    },
    '6864611dda8eca6f382566d3': {
      _id: '6864611dda8eca6f382566d3',
      subject: 'proxy random number',
      description: 11.853693966846834,
      userId: '6864611dda8eca6f382566d2',
    },
    '6864611dda8eca6f382566d5': {
      _id: '6864611dda8eca6f382566d5',
      subject: 'proxy random number',
      description: 52.164879178914234,
      userId: '6864611dda8eca6f382566d4',
    },
    '6864611dda8eca6f382566d7': {
      _id: '6864611dda8eca6f382566d7',
      subject: 'proxy random number',
      description: 13.384122913904827,
      userId: '6864611dda8eca6f382566d6',
    },
    '6864611dda8eca6f382566d9': {
      _id: '6864611dda8eca6f382566d9',
      subject: 'proxy random number',
      description: 23.388685127587003,
      userId: '6864611dda8eca6f382566d8',
    },
    '6864611dda8eca6f382566db': {
      _id: '6864611dda8eca6f382566db',
      subject: 'proxy random number',
      description: 18.055121120182747,
      userId: '6864611dda8eca6f382566da',
    },
    '6864611dda8eca6f382566dd': {
      _id: '6864611dda8eca6f382566dd',
      subject: 'proxy random number',
      description: 80.37762559403888,
      userId: '6864611dda8eca6f382566dc',
    },
    '6864611dda8eca6f382566df': {
      _id: '6864611dda8eca6f382566df',
      subject: 'proxy random number',
      description: 31.909403401423717,
      userId: '6864611dda8eca6f382566de',
    },
    '6864611dda8eca6f382566e1': {
      _id: '6864611dda8eca6f382566e1',
      subject: 'proxy random number',
      description: 92.7439631552399,
      userId: '6864611dda8eca6f382566e0',
    },
    '6864611dda8eca6f382566e3': {
      _id: '6864611dda8eca6f382566e3',
      subject: 'proxy random number',
      description: 98.12250977159671,
      userId: '6864611dda8eca6f382566e2',
    },
    '6864611dda8eca6f382566e5': {
      _id: '6864611dda8eca6f382566e5',
      subject: 'proxy random number',
      description: 100.13542214875403,
      userId: '6864611dda8eca6f382566e4',
    },
    '6864611dda8eca6f382566e7': {
      _id: '6864611dda8eca6f382566e7',
      subject: 'proxy random number',
      description: 42.039688612759996,
      userId: '6864611dda8eca6f382566e6',
    },
    '6864611dda8eca6f382566e9': {
      _id: '6864611dda8eca6f382566e9',
      subject: 'proxy random number',
      description: 40.51438789172792,
      userId: '6864611dda8eca6f382566e8',
    },
    '6864611dda8eca6f382566eb': {
      _id: '6864611dda8eca6f382566eb',
      subject: 'proxy random number',
      description: 70.772013962606,
      userId: '6864611dda8eca6f382566ea',
    },
    '6864611dda8eca6f382566ed': {
      _id: '6864611dda8eca6f382566ed',
      subject: 'proxy random number',
      description: 84.69072626388456,
      userId: '6864611dda8eca6f382566ec',
    },
    '6864611dda8eca6f382566ef': {
      _id: '6864611dda8eca6f382566ef',
      subject: 'proxy random number',
      description: 60.405978859785776,
      userId: '6864611dda8eca6f382566ee',
    },
    '6864611dda8eca6f382566f1': {
      _id: '6864611dda8eca6f382566f1',
      subject: 'proxy random number',
      description: 20.942027197762435,
      userId: '6864611dda8eca6f382566f0',
    },
    '6864611dda8eca6f382566f3': {
      _id: '6864611dda8eca6f382566f3',
      subject: 'proxy random number',
      description: 66.62023222901132,
      userId: '6864611dda8eca6f382566f2',
    },
    '6864611dda8eca6f382566f5': {
      _id: '6864611dda8eca6f382566f5',
      subject: 'proxy random number',
      description: 23.902210723384474,
      userId: '6864611dda8eca6f382566f4',
    },
    '6864611dda8eca6f382566f7': {
      _id: '6864611dda8eca6f382566f7',
      subject: 'proxy random number',
      description: 70.32024348119867,
      userId: '6864611dda8eca6f382566f6',
    },
    '6864611dda8eca6f382566f9': {
      _id: '6864611dda8eca6f382566f9',
      subject: 'proxy random number',
      description: 5.136780387608008,
      userId: '6864611dda8eca6f382566f8',
    },
    '6864611dda8eca6f382566fb': {
      _id: '6864611dda8eca6f382566fb',
      subject: 'proxy random number',
      description: 59.375026964193744,
      userId: '6864611dda8eca6f382566fa',
    },
    '6864611dda8eca6f382566fd': {
      _id: '6864611dda8eca6f382566fd',
      subject: 'proxy random number',
      description: 21.428188688699066,
      userId: '6864611dda8eca6f382566fc',
    },
    '6864611dda8eca6f382566ff': {
      _id: '6864611dda8eca6f382566ff',
      subject: 'proxy random number',
      description: 89.66157847267651,
      userId: '6864611dda8eca6f382566fe',
    },
    '6864611dda8eca6f38256701': {
      _id: '6864611dda8eca6f38256701',
      subject: 'proxy random number',
      description: 98.3471122352581,
      userId: '6864611dda8eca6f38256700',
    },
    '6864611dda8eca6f38256703': {
      _id: '6864611dda8eca6f38256703',
      subject: 'proxy random number',
      description: 100.02735401624321,
      userId: '6864611dda8eca6f38256702',
    },
    '6864611dda8eca6f38256705': {
      _id: '6864611dda8eca6f38256705',
      subject: 'proxy random number',
      description: 19.059314665907955,
      userId: '6864611dda8eca6f38256704',
    },
    '6864611dda8eca6f38256707': {
      _id: '6864611dda8eca6f38256707',
      subject: 'proxy random number',
      description: 92.25368278760644,
      userId: '6864611dda8eca6f38256706',
    },
    '6864611dda8eca6f38256709': {
      _id: '6864611dda8eca6f38256709',
      subject: 'proxy random number',
      description: 17.177748832891893,
      userId: '6864611dda8eca6f38256708',
    },
    '6864611dda8eca6f3825670b': {
      _id: '6864611dda8eca6f3825670b',
      subject: 'proxy random number',
      description: 22.881167620415674,
      userId: '6864611dda8eca6f3825670a',
    },
    '6864611dda8eca6f3825670d': {
      _id: '6864611dda8eca6f3825670d',
      subject: 'proxy random number',
      description: 88.45773012572083,
      userId: '6864611dda8eca6f3825670c',
    },
    '6864611dda8eca6f3825670f': {
      _id: '6864611dda8eca6f3825670f',
      subject: 'proxy random number',
      description: 42.15085074311815,
      userId: '6864611dda8eca6f3825670e',
    },
    '6864611dda8eca6f38256711': {
      _id: '6864611dda8eca6f38256711',
      subject: 'proxy random number',
      description: 36.59087429318721,
      userId: '6864611dda8eca6f38256710',
    },
    '6864611dda8eca6f38256713': {
      _id: '6864611dda8eca6f38256713',
      subject: 'proxy random number',
      description: 1.5870962407368285,
      userId: '6864611dda8eca6f38256712',
    },
    '6864611dda8eca6f38256715': {
      _id: '6864611dda8eca6f38256715',
      subject: 'proxy random number',
      description: 21.916156668348407,
      userId: '6864611dda8eca6f38256714',
    },
    '6864611dda8eca6f38256717': {
      _id: '6864611dda8eca6f38256717',
      subject: 'proxy random number',
      description: 72.98871854505973,
      userId: '6864611dda8eca6f38256716',
    },
    '6864611dda8eca6f38256719': {
      _id: '6864611dda8eca6f38256719',
      subject: 'proxy random number',
      description: 70.20925662519059,
      userId: '6864611dda8eca6f38256718',
    },
    '6864611dda8eca6f3825671b': {
      _id: '6864611dda8eca6f3825671b',
      subject: 'proxy random number',
      description: 35.709385863491015,
      userId: '6864611dda8eca6f3825671a',
    },
    '6864611dda8eca6f3825671d': {
      _id: '6864611dda8eca6f3825671d',
      subject: 'proxy random number',
      description: 31.181081812193234,
      userId: '6864611dda8eca6f3825671c',
    },
    '6864611dda8eca6f3825671f': {
      _id: '6864611dda8eca6f3825671f',
      subject: 'proxy random number',
      description: 34.77878228995315,
      userId: '6864611dda8eca6f3825671e',
    },
    '6864611dda8eca6f38256721': {
      _id: '6864611dda8eca6f38256721',
      subject: 'proxy random number',
      description: 75.16091256884218,
      userId: '6864611dda8eca6f38256720',
    },
    '6864611dda8eca6f38256723': {
      _id: '6864611dda8eca6f38256723',
      subject: 'proxy random number',
      description: 42.73136360300287,
      userId: '6864611dda8eca6f38256722',
    },
    '6864611dda8eca6f38256725': {
      _id: '6864611dda8eca6f38256725',
      subject: 'proxy random number',
      description: 69.42592322009158,
      userId: '6864611dda8eca6f38256724',
    },
    '6864611dda8eca6f38256727': {
      _id: '6864611dda8eca6f38256727',
      subject: 'proxy random number',
      description: 70.17317458059797,
      userId: '6864611dda8eca6f38256726',
    },
    '6864611dda8eca6f38256729': {
      _id: '6864611dda8eca6f38256729',
      subject: 'proxy random number',
      description: 31.248096294059266,
      userId: '6864611dda8eca6f38256728',
    },
    '6864611dda8eca6f3825672b': {
      _id: '6864611dda8eca6f3825672b',
      subject: 'proxy random number',
      description: 72.09867828293113,
      userId: '6864611dda8eca6f3825672a',
    },
    '6864611dda8eca6f3825672d': {
      _id: '6864611dda8eca6f3825672d',
      subject: 'proxy random number',
      description: 45.30496143314724,
      userId: '6864611dda8eca6f3825672c',
    },
    '6864611dda8eca6f3825672f': {
      _id: '6864611dda8eca6f3825672f',
      subject: 'proxy random number',
      description: 100.96055627976553,
      userId: '6864611dda8eca6f3825672e',
    },
    '6864611dda8eca6f38256731': {
      _id: '6864611dda8eca6f38256731',
      subject: 'proxy random number',
      description: 50.68918495462729,
      userId: '6864611dda8eca6f38256730',
    },
    '6864611dda8eca6f38256733': {
      _id: '6864611dda8eca6f38256733',
      subject: 'proxy random number',
      description: 55.662918879513825,
      userId: '6864611dda8eca6f38256732',
    },
    '6864611dda8eca6f38256735': {
      _id: '6864611dda8eca6f38256735',
      subject: 'proxy random number',
      description: 62.677858783951265,
      userId: '6864611dda8eca6f38256734',
    },
    '6864611dda8eca6f38256737': {
      _id: '6864611dda8eca6f38256737',
      subject: 'proxy random number',
      description: 75.14748276852386,
      userId: '6864611dda8eca6f38256736',
    },
    '6864611dda8eca6f38256739': {
      _id: '6864611dda8eca6f38256739',
      subject: 'proxy random number',
      description: 76.90262752417173,
      userId: '6864611dda8eca6f38256738',
    },
    '6864611dda8eca6f3825673b': {
      _id: '6864611dda8eca6f3825673b',
      subject: 'proxy random number',
      description: 36.531935047677734,
      userId: '6864611dda8eca6f3825673a',
    },
    '6864611dda8eca6f3825673d': {
      _id: '6864611dda8eca6f3825673d',
      subject: 'proxy random number',
      description: 59.29801525087459,
      userId: '6864611dda8eca6f3825673c',
    },
    '6864611dda8eca6f3825673f': {
      _id: '6864611dda8eca6f3825673f',
      subject: 'proxy random number',
      description: 64.76972954226503,
      userId: '6864611dda8eca6f3825673e',
    },
    '6864611dda8eca6f38256741': {
      _id: '6864611dda8eca6f38256741',
      subject: 'proxy random number',
      description: 46.81531599243584,
      userId: '6864611dda8eca6f38256740',
    },
    '6864611dda8eca6f38256743': {
      _id: '6864611dda8eca6f38256743',
      subject: 'proxy random number',
      description: 62.31339422419464,
      userId: '6864611dda8eca6f38256742',
    },
    '6864611dda8eca6f38256745': {
      _id: '6864611dda8eca6f38256745',
      subject: 'proxy random number',
      description: 81.89540184741297,
      userId: '6864611dda8eca6f38256744',
    },
    '6864611dda8eca6f38256747': {
      _id: '6864611dda8eca6f38256747',
      subject: 'proxy random number',
      description: 30.74252195337972,
      userId: '6864611dda8eca6f38256746',
    },
    '6864611dda8eca6f38256749': {
      _id: '6864611dda8eca6f38256749',
      subject: 'proxy random number',
      description: 83.05475299884199,
      userId: '6864611dda8eca6f38256748',
    },
    '6864611dda8eca6f3825674b': {
      _id: '6864611dda8eca6f3825674b',
      subject: 'proxy random number',
      description: 14.597962115574337,
      userId: '6864611dda8eca6f3825674a',
    },
    '6864611dda8eca6f3825674d': {
      _id: '6864611dda8eca6f3825674d',
      subject: 'proxy random number',
      description: 88.97201001830648,
      userId: '6864611dda8eca6f3825674c',
    },
    '6864611dda8eca6f3825674f': {
      _id: '6864611dda8eca6f3825674f',
      subject: 'proxy random number',
      description: 19.100904564951215,
      userId: '6864611dda8eca6f3825674e',
    },
    '6864611dda8eca6f38256751': {
      _id: '6864611dda8eca6f38256751',
      subject: 'proxy random number',
      description: 30.734627883230115,
      userId: '6864611dda8eca6f38256750',
    },
    '6864611dda8eca6f38256753': {
      _id: '6864611dda8eca6f38256753',
      subject: 'proxy random number',
      description: 48.96183943671903,
      userId: '6864611dda8eca6f38256752',
    },
    '6864611dda8eca6f38256755': {
      _id: '6864611dda8eca6f38256755',
      subject: 'proxy random number',
      description: 88.52922819796467,
      userId: '6864611dda8eca6f38256754',
    },
    '6864611dda8eca6f38256757': {
      _id: '6864611dda8eca6f38256757',
      subject: 'proxy random number',
      description: 69.43573106037151,
      userId: '6864611dda8eca6f38256756',
    },
    '6864611dda8eca6f38256759': {
      _id: '6864611dda8eca6f38256759',
      subject: 'proxy random number',
      description: 6.976739545781817,
      userId: '6864611dda8eca6f38256758',
    },
    '6864611dda8eca6f3825675b': {
      _id: '6864611dda8eca6f3825675b',
      subject: 'proxy random number',
      description: 67.21540941789976,
      userId: '6864611dda8eca6f3825675a',
    },
    '6864611dda8eca6f3825675d': {
      _id: '6864611dda8eca6f3825675d',
      subject: 'proxy random number',
      description: 30.14687573944581,
      userId: '6864611dda8eca6f3825675c',
    },
    '6864611dda8eca6f3825675f': {
      _id: '6864611dda8eca6f3825675f',
      subject: 'proxy random number',
      description: 85.7763684622179,
      userId: '6864611dda8eca6f3825675e',
    },
    '6864611dda8eca6f38256761': {
      _id: '6864611dda8eca6f38256761',
      subject: 'proxy random number',
      description: 39.121175116593605,
      userId: '6864611dda8eca6f38256760',
    },
    '6864611dda8eca6f38256763': {
      _id: '6864611dda8eca6f38256763',
      subject: 'proxy random number',
      description: 80.51556980243816,
      userId: '6864611dda8eca6f38256762',
    },
    '6864611dda8eca6f38256765': {
      _id: '6864611dda8eca6f38256765',
      subject: 'proxy random number',
      description: 73.77250302395703,
      userId: '6864611dda8eca6f38256764',
    },
    '6864611dda8eca6f38256767': {
      _id: '6864611dda8eca6f38256767',
      subject: 'proxy random number',
      description: 30.826670864518423,
      userId: '6864611dda8eca6f38256766',
    },
    '6864611dda8eca6f38256769': {
      _id: '6864611dda8eca6f38256769',
      subject: 'proxy random number',
      description: 90.69007821510058,
      userId: '6864611dda8eca6f38256768',
    },
    '6864611dda8eca6f3825676b': {
      _id: '6864611dda8eca6f3825676b',
      subject: 'proxy random number',
      description: 9.866664741607245,
      userId: '6864611dda8eca6f3825676a',
    },
    '6864611dda8eca6f3825676d': {
      _id: '6864611dda8eca6f3825676d',
      subject: 'proxy random number',
      description: 23.999017957030855,
      userId: '6864611dda8eca6f3825676c',
    },
    '6864611dda8eca6f3825676f': {
      _id: '6864611dda8eca6f3825676f',
      subject: 'proxy random number',
      description: 85.9589573698145,
      userId: '6864611dda8eca6f3825676e',
    },
  }
}
