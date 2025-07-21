// https://github.com/EnCiv/civil-pursuit/issues/171

const { initDiscussion, getConclusionIds, insertStatementId, getStatementIds, rankMostImportant, putGroupings, Discussions } = require('../dturn')

import { expect } from '@jest/globals'

// Config
const DISCUSSION_ID = 1
const DISCUSSION_ID2 = 10

// Tests
test('Fail if discussion not initialized.', async () => {
  const conclusionIds = await getConclusionIds(DISCUSSION_ID)
  expect(conclusionIds).toBeUndefined()
})

test('Succeed if all arguments are valid.', async () => {
  initDiscussion(DISCUSSION_ID, {
    group_size: 5,
    gmajority: 0.9,
    max_rounds: 10,
    min_shown_count: 6,
    min_rank: 3,
    updateUInfo: () => {},
    getAllUInfo: async () => [],
  })
})

test('Fail if all options are not valid.', async () => {
  const conclusion = await initDiscussion(DISCUSSION_ID, { a_nonexistent_option: 12345 })
  expect(conclusion).toBeUndefined()
})

test('Fail if at least 1 option is not valid.', async () => {
  const conclusion = await initDiscussion(DISCUSSION_ID, { group_size: 10, a_nonexistent_option: 12345 })
  expect(conclusion).toBeUndefined()
})

test('Undefined if discussion not complete.', async () => {
  const props = []

  // insert statements
  for (let i = 0; i < 4; i++) {
    props.push([DISCUSSION_ID, `user${i}`, `statement${i}`])
  }
  for await (const args of props) {
    await insertStatementId(...args)
  }

  const conclusions = await getConclusionIds(DISCUSSION_ID)
  expect(conclusions).toBeUndefined()
})

test('Return conclusion if discussion is complete.', async () => {
  await initDiscussion(DISCUSSION_ID2, {
    group_size: 5,
    gmajority: 0.5,
    max_rounds: 10,
    min_shown_count: 1,
    min_rank: 1,
    updateUInfo: () => {},
    getAllUInfo: async () => {
      const Uinfos = Object.keys(UserInfo).map(uId => {
        const rounds = UserInfo[uId][1]
        return { [uId]: { [DISCUSSION_ID2]: rounds } }
      })
      console.info('Uinfos.length', Uinfos.length)
      return Uinfos
    },
  })
  const conclusions = await getConclusionIds(DISCUSSION_ID2)
  expect(conclusions).toMatchObject(['68587e7595bf3df6846d46a5'])
})

// below is UInfo data extracted from app/dturn/test.js for group_size 5 and number of participants 130
const UserInfo = {
  '68587e7595bf3df6846d4672': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4672',
        shownStatementIds: {
          '68587e7595bf3df6846d4673': { rank: 0, author: true },
          '68587e7595bf3df6846d474f': { rank: 0 },
          '68587e7595bf3df6846d473d': { rank: 0 },
          '68587e7595bf3df6846d46d1': { rank: 0 },
          '68587e7595bf3df6846d4771': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4672',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4672',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4674': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4674',
        shownStatementIds: {
          '68587e7595bf3df6846d4675': { rank: 0, author: true },
          '68587e7595bf3df6846d474f': { rank: 0 },
          '68587e7595bf3df6846d473d': { rank: 0 },
          '68587e7595bf3df6846d46d1': { rank: 0 },
          '68587e7595bf3df6846d4771': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4674',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4674',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4676': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4676',
        shownStatementIds: {
          '68587e7595bf3df6846d4677': { rank: 0, author: true },
          '68587e7595bf3df6846d474f': { rank: 0 },
          '68587e7595bf3df6846d473d': { rank: 0 },
          '68587e7595bf3df6846d46d1': { rank: 0 },
          '68587e7595bf3df6846d4771': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4676',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4676',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4678': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4678',
        shownStatementIds: {
          '68587e7595bf3df6846d4679': { rank: 0, author: true },
          '68587e7595bf3df6846d473b': { rank: 0 },
          '68587e7595bf3df6846d470d': { rank: 0 },
          '68587e7595bf3df6846d475f': { rank: 1 },
          '68587e7595bf3df6846d4757': { rank: 0 },
        },
        groupings: [['68587e7595bf3df6846d4679', '68587e7595bf3df6846d473b']],
      },
      1: {
        userId: '68587e7595bf3df6846d4678',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4678',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d467a': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d467a',
        shownStatementIds: {
          '68587e7595bf3df6846d467b': { rank: 0, author: true },
          '68587e7595bf3df6846d473b': { rank: 0 },
          '68587e7595bf3df6846d470d': { rank: 0 },
          '68587e7595bf3df6846d475f': { rank: 1 },
          '68587e7595bf3df6846d4757': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d467a',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d467a',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d467c': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d467c',
        shownStatementIds: {
          '68587e7595bf3df6846d467d': { rank: 0, author: true },
          '68587e7595bf3df6846d473b': { rank: 0 },
          '68587e7595bf3df6846d470d': { rank: 0 },
          '68587e7595bf3df6846d475f': { rank: 1 },
          '68587e7595bf3df6846d4757': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d467c',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d467c',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d467e': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d467e',
        shownStatementIds: {
          '68587e7595bf3df6846d467f': { rank: 1, author: true },
          '68587e7595bf3df6846d473b': { rank: 0 },
          '68587e7595bf3df6846d470d': { rank: 0 },
          '68587e7595bf3df6846d475f': { rank: 0 },
          '68587e7595bf3df6846d4757': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d467e',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d467e',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4680': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4680',
        shownStatementIds: {
          '68587e7595bf3df6846d4681': { rank: 0, author: true },
          '68587e7595bf3df6846d473b': { rank: 0 },
          '68587e7595bf3df6846d470d': { rank: 0 },
          '68587e7595bf3df6846d475f': { rank: 1 },
          '68587e7595bf3df6846d4757': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4680',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4680',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4682': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4682',
        shownStatementIds: {
          '68587e7595bf3df6846d4683': { rank: 0, author: true },
          '68587e7595bf3df6846d4681': { rank: 0 },
          '68587e7595bf3df6846d4677': { rank: 1 },
          '68587e7595bf3df6846d4675': { rank: 0 },
          '68587e7595bf3df6846d4673': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4682',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4682',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4684': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4684',
        shownStatementIds: {
          '68587e7595bf3df6846d4685': { rank: 1, author: true },
          '68587e7595bf3df6846d4681': { rank: 0 },
          '68587e7595bf3df6846d4677': { rank: 0 },
          '68587e7595bf3df6846d4675': { rank: 0 },
          '68587e7595bf3df6846d4673': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4684',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4684',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4686': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4686',
        shownStatementIds: {
          '68587e7595bf3df6846d4687': { rank: 0, author: true },
          '68587e7595bf3df6846d4681': { rank: 0 },
          '68587e7595bf3df6846d4677': { rank: 1 },
          '68587e7595bf3df6846d4675': { rank: 0 },
          '68587e7595bf3df6846d4673': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4686',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4686',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4688': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4688',
        shownStatementIds: {
          '68587e7595bf3df6846d4689': { rank: 0, author: true },
          '68587e7595bf3df6846d4681': { rank: 0 },
          '68587e7595bf3df6846d4677': { rank: 1 },
          '68587e7595bf3df6846d4675': { rank: 0 },
          '68587e7595bf3df6846d4673': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4688',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4688',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d468a': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d468a',
        shownStatementIds: {
          '68587e7595bf3df6846d468b': { rank: 0, author: true },
          '68587e7595bf3df6846d4681': { rank: 0 },
          '68587e7595bf3df6846d4677': { rank: 1 },
          '68587e7595bf3df6846d4675': { rank: 0 },
          '68587e7595bf3df6846d4673': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d468a',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d468a',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d468c': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d468c',
        shownStatementIds: {
          '68587e7595bf3df6846d468d': { rank: 1, author: true },
          '68587e7595bf3df6846d4689': { rank: 0 },
          '68587e7595bf3df6846d467b': { rank: 0 },
          '68587e7595bf3df6846d467d': { rank: 0 },
          '68587e7595bf3df6846d4679': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d468c',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d468c',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d468e': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d468e',
        shownStatementIds: {
          '68587e7595bf3df6846d468f': { rank: 0, author: true },
          '68587e7595bf3df6846d4689': { rank: 0 },
          '68587e7595bf3df6846d467b': { rank: 1 },
          '68587e7595bf3df6846d467d': { rank: 0 },
          '68587e7595bf3df6846d4679': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d468e',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d468e',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4690': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4690',
        shownStatementIds: {
          '68587e7595bf3df6846d4691': { rank: 1, author: true },
          '68587e7595bf3df6846d4689': { rank: 0 },
          '68587e7595bf3df6846d467b': { rank: 0 },
          '68587e7595bf3df6846d467d': { rank: 0 },
          '68587e7595bf3df6846d4679': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4690',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4690',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4692': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4692',
        shownStatementIds: {
          '68587e7595bf3df6846d4693': { rank: 0, author: true },
          '68587e7595bf3df6846d4689': { rank: 0 },
          '68587e7595bf3df6846d467b': { rank: 1 },
          '68587e7595bf3df6846d467d': { rank: 0 },
          '68587e7595bf3df6846d4679': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4692',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4692',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4694': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4694',
        shownStatementIds: {
          '68587e7595bf3df6846d4695': { rank: 0, author: true },
          '68587e7595bf3df6846d4689': { rank: 0 },
          '68587e7595bf3df6846d467b': { rank: 1 },
          '68587e7595bf3df6846d467d': { rank: 0 },
          '68587e7595bf3df6846d4679': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4694',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4694',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4696': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4696',
        shownStatementIds: {
          '68587e7595bf3df6846d4697': { rank: 0, author: true },
          '68587e7595bf3df6846d468d': { rank: 1 },
          '68587e7595bf3df6846d4683': { rank: 0 },
          '68587e7595bf3df6846d4695': { rank: 0 },
          '68587e7595bf3df6846d468f': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4696',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4696',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4698': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4698',
        shownStatementIds: {
          '68587e7595bf3df6846d4699': { rank: 1, author: true },
          '68587e7595bf3df6846d468d': { rank: 0 },
          '68587e7595bf3df6846d4683': { rank: 0 },
          '68587e7595bf3df6846d4695': { rank: 0 },
          '68587e7595bf3df6846d468f': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4698',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4698',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d469a': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d469a',
        shownStatementIds: {
          '68587e7595bf3df6846d469b': { rank: 0, author: true },
          '68587e7595bf3df6846d468d': { rank: 1 },
          '68587e7595bf3df6846d4683': { rank: 0 },
          '68587e7595bf3df6846d4695': { rank: 0 },
          '68587e7595bf3df6846d468f': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d469a',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d469a',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d469c': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d469c',
        shownStatementIds: {
          '68587e7595bf3df6846d469d': { rank: 1, author: true },
          '68587e7595bf3df6846d468d': { rank: 0 },
          '68587e7595bf3df6846d4683': { rank: 0 },
          '68587e7595bf3df6846d4695': { rank: 0 },
          '68587e7595bf3df6846d468f': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d469c',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d469c',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d469e': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d469e',
        shownStatementIds: {
          '68587e7595bf3df6846d469f': { rank: 0, author: true },
          '68587e7595bf3df6846d468d': { rank: 1 },
          '68587e7595bf3df6846d4683': { rank: 0 },
          '68587e7595bf3df6846d4695': { rank: 0 },
          '68587e7595bf3df6846d468f': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d469e',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d469e',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46a0': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46a0',
        shownStatementIds: {
          '68587e7595bf3df6846d46a1': { rank: 0, author: true },
          '68587e7595bf3df6846d4687': { rank: 0 },
          '68587e7595bf3df6846d469b': { rank: 0 },
          '68587e7595bf3df6846d4697': { rank: 1 },
          '68587e7595bf3df6846d4693': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46a0',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46a0',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46a2': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46a2',
        shownStatementIds: {
          '68587e7595bf3df6846d46a3': { rank: 1, author: true },
          '68587e7595bf3df6846d4687': { rank: 0 },
          '68587e7595bf3df6846d469b': { rank: 0 },
          '68587e7595bf3df6846d4697': { rank: 0 },
          '68587e7595bf3df6846d4693': { rank: 0 },
        },
        groupings: [],
      },
    },
  },
  '68587e7595bf3df6846d46a4': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46a4',
        shownStatementIds: {
          '68587e7595bf3df6846d46a5': { rank: 1, author: true },
          '68587e7595bf3df6846d4687': { rank: 0 },
          '68587e7595bf3df6846d469b': { rank: 0 },
          '68587e7595bf3df6846d4697': { rank: 0 },
          '68587e7595bf3df6846d4693': { rank: 0 },
        },
        groupings: [],
      },
    },
  },
  '68587e7595bf3df6846d46a6': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46a6',
        shownStatementIds: {
          '68587e7595bf3df6846d46a7': { rank: 0, author: true },
          '68587e7595bf3df6846d4687': { rank: 0 },
          '68587e7595bf3df6846d469b': { rank: 0 },
          '68587e7595bf3df6846d4697': { rank: 1 },
          '68587e7595bf3df6846d4693': { rank: 0 },
        },
        groupings: [],
      },
    },
  },
  '68587e7595bf3df6846d46a8': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46a8',
        shownStatementIds: {
          '68587e7595bf3df6846d46a9': { rank: 0, author: true },
          '68587e7595bf3df6846d4687': { rank: 0 },
          '68587e7595bf3df6846d469b': { rank: 0 },
          '68587e7595bf3df6846d4697': { rank: 1 },
          '68587e7595bf3df6846d4693': { rank: 0 },
        },
        groupings: [],
      },
    },
  },
  '68587e7595bf3df6846d46aa': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46aa',
        shownStatementIds: {
          '68587e7595bf3df6846d46ab': { rank: 0, author: true },
          '68587e7595bf3df6846d46a9': { rank: 0 },
          '68587e7595bf3df6846d468b': { rank: 1 },
          '68587e7595bf3df6846d469f': { rank: 0 },
          '68587e7595bf3df6846d46a1': { rank: 0 },
        },
        groupings: [],
      },
    },
  },
  '68587e7595bf3df6846d46ac': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46ac',
        shownStatementIds: {
          '68587e7595bf3df6846d46ad': { rank: 0, author: true },
          '68587e7595bf3df6846d46a9': { rank: 0 },
          '68587e7595bf3df6846d468b': { rank: 1 },
          '68587e7595bf3df6846d469f': { rank: 0 },
          '68587e7595bf3df6846d46a1': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46ac',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46ac',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46ae': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46ae',
        shownStatementIds: {
          '68587e7595bf3df6846d46af': { rank: 0, author: true },
          '68587e7595bf3df6846d46a9': { rank: 0 },
          '68587e7595bf3df6846d468b': { rank: 1 },
          '68587e7595bf3df6846d469f': { rank: 0 },
          '68587e7595bf3df6846d46a1': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46ae',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46ae',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46b0': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46b0',
        shownStatementIds: {
          '68587e7595bf3df6846d46b1': { rank: 0, author: true },
          '68587e7595bf3df6846d46a9': { rank: 0 },
          '68587e7595bf3df6846d468b': { rank: 1 },
          '68587e7595bf3df6846d469f': { rank: 0 },
          '68587e7595bf3df6846d46a1': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46b0',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46b0',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46b2': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46b2',
        shownStatementIds: {
          '68587e7595bf3df6846d46b3': { rank: 0, author: true },
          '68587e7595bf3df6846d46a9': { rank: 0 },
          '68587e7595bf3df6846d468b': { rank: 1 },
          '68587e7595bf3df6846d469f': { rank: 0 },
          '68587e7595bf3df6846d46a1': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46b2',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46b2',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46b4': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46b4',
        shownStatementIds: {
          '68587e7595bf3df6846d46b5': { rank: 0, author: true },
          '68587e7595bf3df6846d46b3': { rank: 0 },
          '68587e7595bf3df6846d467f': { rank: 1 },
          '68587e7595bf3df6846d46af': { rank: 0 },
          '68587e7595bf3df6846d46ad': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46b4',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46b4',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46b6': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46b6',
        shownStatementIds: {
          '68587e7595bf3df6846d46b7': { rank: 0, author: true },
          '68587e7595bf3df6846d46b3': { rank: 0 },
          '68587e7595bf3df6846d467f': { rank: 1 },
          '68587e7595bf3df6846d46af': { rank: 0 },
          '68587e7595bf3df6846d46ad': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46b6',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46b6',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46b8': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46b8',
        shownStatementIds: {
          '68587e7595bf3df6846d46b9': { rank: 0, author: true },
          '68587e7595bf3df6846d46b3': { rank: 0 },
          '68587e7595bf3df6846d467f': { rank: 1 },
          '68587e7595bf3df6846d46af': { rank: 0 },
          '68587e7595bf3df6846d46ad': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46b8',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46b8',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46ba': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46ba',
        shownStatementIds: {
          '68587e7595bf3df6846d46bb': { rank: 0, author: true },
          '68587e7595bf3df6846d46b3': { rank: 0 },
          '68587e7595bf3df6846d467f': { rank: 1 },
          '68587e7595bf3df6846d46af': { rank: 0 },
          '68587e7595bf3df6846d46ad': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46ba',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46ba',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46bc': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46bc',
        shownStatementIds: {
          '68587e7595bf3df6846d46bd': { rank: 0, author: true },
          '68587e7595bf3df6846d46b3': { rank: 0 },
          '68587e7595bf3df6846d467f': { rank: 1 },
          '68587e7595bf3df6846d46af': { rank: 0 },
          '68587e7595bf3df6846d46ad': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46bc',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46bc',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46be': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46be',
        shownStatementIds: {
          '68587e7595bf3df6846d46bf': { rank: 0, author: true },
          '68587e7595bf3df6846d46b1': { rank: 0 },
          '68587e7595bf3df6846d4685': { rank: 1 },
          '68587e7595bf3df6846d46b5': { rank: 0 },
          '68587e7595bf3df6846d4699': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46be',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46be',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46c0': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46c0',
        shownStatementIds: {
          '68587e7595bf3df6846d46c1': { rank: 0, author: true },
          '68587e7595bf3df6846d46b1': { rank: 0 },
          '68587e7595bf3df6846d4685': { rank: 1 },
          '68587e7595bf3df6846d46b5': { rank: 0 },
          '68587e7595bf3df6846d4699': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46c0',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46c0',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46c2': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46c2',
        shownStatementIds: {
          '68587e7595bf3df6846d46c3': { rank: 0, author: true },
          '68587e7595bf3df6846d46b1': { rank: 0 },
          '68587e7595bf3df6846d4685': { rank: 1 },
          '68587e7595bf3df6846d46b5': { rank: 0 },
          '68587e7595bf3df6846d4699': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46c2',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46c2',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46c4': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46c4',
        shownStatementIds: {
          '68587e7595bf3df6846d46c5': { rank: 0, author: true },
          '68587e7595bf3df6846d46b1': { rank: 0 },
          '68587e7595bf3df6846d4685': { rank: 1 },
          '68587e7595bf3df6846d46b5': { rank: 0 },
          '68587e7595bf3df6846d4699': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46c4',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46c4',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46c6': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46c6',
        shownStatementIds: {
          '68587e7595bf3df6846d46c7': { rank: 0, author: true },
          '68587e7595bf3df6846d46b1': { rank: 0 },
          '68587e7595bf3df6846d4685': { rank: 1 },
          '68587e7595bf3df6846d46b5': { rank: 0 },
          '68587e7595bf3df6846d4699': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46c6',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46c6',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46c8': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46c8',
        shownStatementIds: {
          '68587e7595bf3df6846d46c9': { rank: 0, author: true },
          '68587e7595bf3df6846d469d': { rank: 0 },
          '68587e7595bf3df6846d46c7': { rank: 0 },
          '68587e7595bf3df6846d46bb': { rank: 0 },
          '68587e7595bf3df6846d46a5': { rank: 1 },
        },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      1: {
        userId: '68587e7595bf3df6846d46c8',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46c8',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46ca': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46ca',
        shownStatementIds: {
          '68587e7595bf3df6846d46cb': { rank: 0, author: true },
          '68587e7595bf3df6846d469d': { rank: 0 },
          '68587e7595bf3df6846d46c7': { rank: 0 },
          '68587e7595bf3df6846d46bb': { rank: 0 },
          '68587e7595bf3df6846d46a5': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46ca',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46ca',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46cc': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46cc',
        shownStatementIds: {
          '68587e7595bf3df6846d46cd': { rank: 0, author: true },
          '68587e7595bf3df6846d469d': { rank: 0 },
          '68587e7595bf3df6846d46c7': { rank: 0 },
          '68587e7595bf3df6846d46bb': { rank: 0 },
          '68587e7595bf3df6846d46a5': { rank: 1 },
        },
        groupings: [['68587e7595bf3df6846d46bb', '68587e7595bf3df6846d46cd']],
      },
      1: {
        userId: '68587e7595bf3df6846d46cc',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46cc',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46ce': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46ce',
        shownStatementIds: {
          '68587e7595bf3df6846d46cf': { rank: 0, author: true },
          '68587e7595bf3df6846d469d': { rank: 0 },
          '68587e7595bf3df6846d46c7': { rank: 0 },
          '68587e7595bf3df6846d46bb': { rank: 0 },
          '68587e7595bf3df6846d46a5': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46ce',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46ce',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46d0': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46d0',
        shownStatementIds: {
          '68587e7595bf3df6846d46d1': { rank: 0, author: true },
          '68587e7595bf3df6846d469d': { rank: 0 },
          '68587e7595bf3df6846d46c7': { rank: 0 },
          '68587e7595bf3df6846d46bb': { rank: 0 },
          '68587e7595bf3df6846d46a5': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46d0',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46d0',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46d2': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46d2',
        shownStatementIds: {
          '68587e7595bf3df6846d46d3': { rank: 0, author: true },
          '68587e7595bf3df6846d46b7': { rank: 0 },
          '68587e7595bf3df6846d46cd': { rank: 1 },
          '68587e7595bf3df6846d46c3': { rank: 0 },
          '68587e7595bf3df6846d46a7': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46d2',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46d2',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46d4': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46d4',
        shownStatementIds: {
          '68587e7595bf3df6846d46d5': { rank: 1, author: true },
          '68587e7595bf3df6846d46b7': { rank: 0 },
          '68587e7595bf3df6846d46cd': { rank: 0 },
          '68587e7595bf3df6846d46c3': { rank: 0 },
          '68587e7595bf3df6846d46a7': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46d4',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46d4',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46d6': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46d6',
        shownStatementIds: {
          '68587e7595bf3df6846d46d7': { rank: 1, author: true },
          '68587e7595bf3df6846d46b7': { rank: 0 },
          '68587e7595bf3df6846d46cd': { rank: 0 },
          '68587e7595bf3df6846d46c3': { rank: 0 },
          '68587e7595bf3df6846d46a7': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46d6',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46d6',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46d8': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46d8',
        shownStatementIds: {
          '68587e7595bf3df6846d46d9': { rank: 0, author: true },
          '68587e7595bf3df6846d46b7': { rank: 0 },
          '68587e7595bf3df6846d46cd': { rank: 1 },
          '68587e7595bf3df6846d46c3': { rank: 0 },
          '68587e7595bf3df6846d46a7': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46d8',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46d8',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46da': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46da',
        shownStatementIds: {
          '68587e7595bf3df6846d46db': { rank: 0, author: true },
          '68587e7595bf3df6846d46b7': { rank: 0 },
          '68587e7595bf3df6846d46cd': { rank: 1 },
          '68587e7595bf3df6846d46c3': { rank: 0 },
          '68587e7595bf3df6846d46a7': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46da',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46da',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46dc': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46dc',
        shownStatementIds: {
          '68587e7595bf3df6846d46dd': { rank: 0, author: true },
          '68587e7595bf3df6846d46c9': { rank: 1 },
          '68587e7595bf3df6846d46b9': { rank: 0 },
          '68587e7595bf3df6846d46d9': { rank: 0 },
          '68587e7595bf3df6846d46d7': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46dc',
        shownStatementIds: { '68587e7595bf3df6846d467b': { rank: 0 }, '68587e7595bf3df6846d468d': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 1 }, '68587e7595bf3df6846d4697': { rank: 0 }, '68587e7595bf3df6846d468b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d46dc',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46de': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46de',
        shownStatementIds: {
          '68587e7595bf3df6846d46df': { rank: 0, author: true },
          '68587e7595bf3df6846d46c9': { rank: 1 },
          '68587e7595bf3df6846d46b9': { rank: 0 },
          '68587e7595bf3df6846d46d9': { rank: 0 },
          '68587e7595bf3df6846d46d7': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46de',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46de',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46e0': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46e0',
        shownStatementIds: {
          '68587e7595bf3df6846d46e1': { rank: 0, author: true },
          '68587e7595bf3df6846d46c9': { rank: 1 },
          '68587e7595bf3df6846d46b9': { rank: 0 },
          '68587e7595bf3df6846d46d9': { rank: 0 },
          '68587e7595bf3df6846d46d7': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46e0',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46e0',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46e2': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46e2',
        shownStatementIds: {
          '68587e7595bf3df6846d46e3': { rank: 0, author: true },
          '68587e7595bf3df6846d46c9': { rank: 1 },
          '68587e7595bf3df6846d46b9': { rank: 0 },
          '68587e7595bf3df6846d46d9': { rank: 0 },
          '68587e7595bf3df6846d46d7': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46e2',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46e2',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46e4': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46e4',
        shownStatementIds: {
          '68587e7595bf3df6846d46e5': { rank: 0, author: true },
          '68587e7595bf3df6846d46c9': { rank: 1 },
          '68587e7595bf3df6846d46b9': { rank: 0 },
          '68587e7595bf3df6846d46d9': { rank: 0 },
          '68587e7595bf3df6846d46d7': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46e4',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46e4',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46e6': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46e6',
        shownStatementIds: {
          '68587e7595bf3df6846d46e7': { rank: 0, author: true },
          '68587e7595bf3df6846d4691': { rank: 1 },
          '68587e7595bf3df6846d46d3': { rank: 0 },
          '68587e7595bf3df6846d46ab': { rank: 0 },
          '68587e7595bf3df6846d46cb': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46e6',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46e6',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46e8': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46e8',
        shownStatementIds: {
          '68587e7595bf3df6846d46e9': { rank: 0, author: true },
          '68587e7595bf3df6846d4691': { rank: 1 },
          '68587e7595bf3df6846d46d3': { rank: 0 },
          '68587e7595bf3df6846d46ab': { rank: 0 },
          '68587e7595bf3df6846d46cb': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46e8',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46e8',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46ea': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46ea',
        shownStatementIds: {
          '68587e7595bf3df6846d46eb': { rank: 0, author: true },
          '68587e7595bf3df6846d4691': { rank: 1 },
          '68587e7595bf3df6846d46d3': { rank: 0 },
          '68587e7595bf3df6846d46ab': { rank: 0 },
          '68587e7595bf3df6846d46cb': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46ea',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46ea',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46ec': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46ec',
        shownStatementIds: {
          '68587e7595bf3df6846d46ed': { rank: 0, author: true },
          '68587e7595bf3df6846d4691': { rank: 1 },
          '68587e7595bf3df6846d46d3': { rank: 0 },
          '68587e7595bf3df6846d46ab': { rank: 0 },
          '68587e7595bf3df6846d46cb': { rank: 0 },
        },
        groupings: [['68587e7595bf3df6846d46ed', '68587e7595bf3df6846d46cb']],
      },
      1: {
        userId: '68587e7595bf3df6846d46ec',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46ec',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46ee': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46ee',
        shownStatementIds: {
          '68587e7595bf3df6846d46ef': { rank: 0, author: true },
          '68587e7595bf3df6846d4691': { rank: 1 },
          '68587e7595bf3df6846d46d3': { rank: 0 },
          '68587e7595bf3df6846d46ab': { rank: 0 },
          '68587e7595bf3df6846d46cb': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46ee',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46ee',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46f0': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46f0',
        shownStatementIds: {
          '68587e7595bf3df6846d46f1': { rank: 0, author: true },
          '68587e7595bf3df6846d46db': { rank: 0 },
          '68587e7595bf3df6846d46e5': { rank: 0 },
          '68587e7595bf3df6846d46ef': { rank: 0 },
          '68587e7595bf3df6846d46e3': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46f0',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46f0',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46f2': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46f2',
        shownStatementIds: {
          '68587e7595bf3df6846d46f3': { rank: 1, author: true },
          '68587e7595bf3df6846d46db': { rank: 0 },
          '68587e7595bf3df6846d46e5': { rank: 0 },
          '68587e7595bf3df6846d46ef': { rank: 0 },
          '68587e7595bf3df6846d46e3': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46f2',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46f2',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46f4': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46f4',
        shownStatementIds: {
          '68587e7595bf3df6846d46f5': { rank: 1, author: true },
          '68587e7595bf3df6846d46db': { rank: 0 },
          '68587e7595bf3df6846d46e5': { rank: 0 },
          '68587e7595bf3df6846d46ef': { rank: 0 },
          '68587e7595bf3df6846d46e3': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46f4',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46f4',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46f6': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46f6',
        shownStatementIds: {
          '68587e7595bf3df6846d46f7': { rank: 0, author: true },
          '68587e7595bf3df6846d46db': { rank: 0 },
          '68587e7595bf3df6846d46e5': { rank: 0 },
          '68587e7595bf3df6846d46ef': { rank: 0 },
          '68587e7595bf3df6846d46e3': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46f6',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46f6',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46f8': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46f8',
        shownStatementIds: {
          '68587e7595bf3df6846d46f9': { rank: 0, author: true },
          '68587e7595bf3df6846d46db': { rank: 0 },
          '68587e7595bf3df6846d46e5': { rank: 0 },
          '68587e7595bf3df6846d46ef': { rank: 0 },
          '68587e7595bf3df6846d46e3': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46f8',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46f8',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46fa': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46fa',
        shownStatementIds: {
          '68587e7595bf3df6846d46fb': { rank: 0, author: true },
          '68587e7595bf3df6846d46bf': { rank: 0 },
          '68587e7595bf3df6846d46ed': { rank: 0 },
          '68587e7595bf3df6846d46e7': { rank: 1 },
          '68587e7595bf3df6846d46e1': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46fa',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46fa',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46fc': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46fc',
        shownStatementIds: {
          '68587e7595bf3df6846d46fd': { rank: 0, author: true },
          '68587e7595bf3df6846d46bf': { rank: 0 },
          '68587e7595bf3df6846d46ed': { rank: 0 },
          '68587e7595bf3df6846d46e7': { rank: 1 },
          '68587e7595bf3df6846d46e1': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46fc',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46fc',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d46fe': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d46fe',
        shownStatementIds: {
          '68587e7595bf3df6846d46ff': { rank: 0, author: true },
          '68587e7595bf3df6846d46bf': { rank: 0 },
          '68587e7595bf3df6846d46ed': { rank: 0 },
          '68587e7595bf3df6846d46e7': { rank: 1 },
          '68587e7595bf3df6846d46e1': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d46fe',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d46fe',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4700': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4700',
        shownStatementIds: {
          '68587e7595bf3df6846d4701': { rank: 0, author: true },
          '68587e7595bf3df6846d46bf': { rank: 0 },
          '68587e7595bf3df6846d46ed': { rank: 0 },
          '68587e7595bf3df6846d46e7': { rank: 1 },
          '68587e7595bf3df6846d46e1': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4700',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d4700',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4702': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4702',
        shownStatementIds: {
          '68587e7595bf3df6846d4703': { rank: 1, author: true },
          '68587e7595bf3df6846d46bf': { rank: 0 },
          '68587e7595bf3df6846d46ed': { rank: 0 },
          '68587e7595bf3df6846d46e7': { rank: 0 },
          '68587e7595bf3df6846d46e1': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4702',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d4702',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4704': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4704',
        shownStatementIds: {
          '68587e7595bf3df6846d4705': { rank: 0, author: true },
          '68587e7595bf3df6846d46df': { rank: 1 },
          '68587e7595bf3df6846d46eb': { rank: 0 },
          '68587e7595bf3df6846d46fd': { rank: 0 },
          '68587e7595bf3df6846d46ff': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4704',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d4704',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4706': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4706',
        shownStatementIds: {
          '68587e7595bf3df6846d4707': { rank: 0, author: true },
          '68587e7595bf3df6846d46df': { rank: 1 },
          '68587e7595bf3df6846d46eb': { rank: 0 },
          '68587e7595bf3df6846d46fd': { rank: 0 },
          '68587e7595bf3df6846d46ff': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4706',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d4706',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4708': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4708',
        shownStatementIds: {
          '68587e7595bf3df6846d4709': { rank: 0, author: true },
          '68587e7595bf3df6846d46df': { rank: 1 },
          '68587e7595bf3df6846d46eb': { rank: 0 },
          '68587e7595bf3df6846d46fd': { rank: 0 },
          '68587e7595bf3df6846d46ff': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4708',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d4708',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d470a': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d470a',
        shownStatementIds: {
          '68587e7595bf3df6846d470b': { rank: 0, author: true },
          '68587e7595bf3df6846d46df': { rank: 1 },
          '68587e7595bf3df6846d46eb': { rank: 0 },
          '68587e7595bf3df6846d46fd': { rank: 0 },
          '68587e7595bf3df6846d46ff': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d470a',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d470a',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d470c': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d470c',
        shownStatementIds: {
          '68587e7595bf3df6846d470d': { rank: 0, author: true },
          '68587e7595bf3df6846d46df': { rank: 1 },
          '68587e7595bf3df6846d46eb': { rank: 0 },
          '68587e7595bf3df6846d46fd': { rank: 0 },
          '68587e7595bf3df6846d46ff': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d470c',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d470c',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d470e': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d470e',
        shownStatementIds: {
          '68587e7595bf3df6846d470f': { rank: 0, author: true },
          '68587e7595bf3df6846d46f7': { rank: 0 },
          '68587e7595bf3df6846d4701': { rank: 0 },
          '68587e7595bf3df6846d4705': { rank: 1 },
          '68587e7595bf3df6846d46d5': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d470e',
        shownStatementIds: { '68587e7595bf3df6846d46cd': { rank: 0 }, '68587e7595bf3df6846d4685': { rank: 0 }, '68587e7595bf3df6846d467f': { rank: 0 }, '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d46c9': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d46a5', '68587e7595bf3df6846d46c9']],
      },
      2: {
        userId: '68587e7595bf3df6846d470e',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4710': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4710',
        shownStatementIds: {
          '68587e7595bf3df6846d4711': { rank: 0, author: true },
          '68587e7595bf3df6846d46f7': { rank: 0 },
          '68587e7595bf3df6846d4701': { rank: 0 },
          '68587e7595bf3df6846d4705': { rank: 1 },
          '68587e7595bf3df6846d46d5': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4710',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4710',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4712': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4712',
        shownStatementIds: {
          '68587e7595bf3df6846d4713': { rank: 0, author: true },
          '68587e7595bf3df6846d46f7': { rank: 0 },
          '68587e7595bf3df6846d4701': { rank: 0 },
          '68587e7595bf3df6846d4705': { rank: 1 },
          '68587e7595bf3df6846d46d5': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4712',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4712',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4714': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4714',
        shownStatementIds: {
          '68587e7595bf3df6846d4715': { rank: 0, author: true },
          '68587e7595bf3df6846d46f7': { rank: 0 },
          '68587e7595bf3df6846d4701': { rank: 0 },
          '68587e7595bf3df6846d4705': { rank: 1 },
          '68587e7595bf3df6846d46d5': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4714',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4714',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4716': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4716',
        shownStatementIds: {
          '68587e7595bf3df6846d4717': { rank: 0, author: true },
          '68587e7595bf3df6846d46f7': { rank: 0 },
          '68587e7595bf3df6846d4701': { rank: 0 },
          '68587e7595bf3df6846d4705': { rank: 1 },
          '68587e7595bf3df6846d46d5': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4716',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4716',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4718': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4718',
        shownStatementIds: {
          '68587e7595bf3df6846d4719': { rank: 0, author: true },
          '68587e7595bf3df6846d4715': { rank: 0 },
          '68587e7595bf3df6846d4707': { rank: 0 },
          '68587e7595bf3df6846d46f1': { rank: 0 },
          '68587e7595bf3df6846d46e9': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4718',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4718',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d471a': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d471a',
        shownStatementIds: {
          '68587e7595bf3df6846d471b': { rank: 0, author: true },
          '68587e7595bf3df6846d4715': { rank: 0 },
          '68587e7595bf3df6846d4707': { rank: 0 },
          '68587e7595bf3df6846d46f1': { rank: 0 },
          '68587e7595bf3df6846d46e9': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d471a',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d471a',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d471c': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d471c',
        shownStatementIds: {
          '68587e7595bf3df6846d471d': { rank: 0, author: true },
          '68587e7595bf3df6846d4715': { rank: 0 },
          '68587e7595bf3df6846d4707': { rank: 0 },
          '68587e7595bf3df6846d46f1': { rank: 0 },
          '68587e7595bf3df6846d46e9': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d471c',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d471c',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d471e': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d471e',
        shownStatementIds: {
          '68587e7595bf3df6846d471f': { rank: 0, author: true },
          '68587e7595bf3df6846d4715': { rank: 0 },
          '68587e7595bf3df6846d4707': { rank: 0 },
          '68587e7595bf3df6846d46f1': { rank: 0 },
          '68587e7595bf3df6846d46e9': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d471e',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d471e',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4720': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4720',
        shownStatementIds: {
          '68587e7595bf3df6846d4721': { rank: 0, author: true },
          '68587e7595bf3df6846d4715': { rank: 0 },
          '68587e7595bf3df6846d4707': { rank: 0 },
          '68587e7595bf3df6846d46f1': { rank: 0 },
          '68587e7595bf3df6846d46e9': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4720',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4720',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4722': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4722',
        shownStatementIds: {
          '68587e7595bf3df6846d4723': { rank: 0, author: true },
          '68587e7595bf3df6846d46fb': { rank: 1 },
          '68587e7595bf3df6846d46c1': { rank: 0 },
          '68587e7595bf3df6846d46bd': { rank: 0 },
          '68587e7595bf3df6846d4711': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4722',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4722',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4724': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4724',
        shownStatementIds: {
          '68587e7595bf3df6846d4725': { rank: 1, author: true },
          '68587e7595bf3df6846d46fb': { rank: 0 },
          '68587e7595bf3df6846d46c1': { rank: 0 },
          '68587e7595bf3df6846d46bd': { rank: 0 },
          '68587e7595bf3df6846d4711': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4724',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4724',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4726': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4726',
        shownStatementIds: {
          '68587e7595bf3df6846d4727': { rank: 0, author: true },
          '68587e7595bf3df6846d46fb': { rank: 1 },
          '68587e7595bf3df6846d46c1': { rank: 0 },
          '68587e7595bf3df6846d46bd': { rank: 0 },
          '68587e7595bf3df6846d4711': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4726',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4726',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4728': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4728',
        shownStatementIds: {
          '68587e7595bf3df6846d4729': { rank: 0, author: true },
          '68587e7595bf3df6846d46fb': { rank: 1 },
          '68587e7595bf3df6846d46c1': { rank: 0 },
          '68587e7595bf3df6846d46bd': { rank: 0 },
          '68587e7595bf3df6846d4711': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4728',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4728',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d472a': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d472a',
        shownStatementIds: {
          '68587e7595bf3df6846d472b': { rank: 0, author: true },
          '68587e7595bf3df6846d46fb': { rank: 1 },
          '68587e7595bf3df6846d46c1': { rank: 0 },
          '68587e7595bf3df6846d46bd': { rank: 0 },
          '68587e7595bf3df6846d4711': { rank: 0 },
        },
        groupings: [['68587e7595bf3df6846d472b', '68587e7595bf3df6846d46c1']],
      },
      1: {
        userId: '68587e7595bf3df6846d472a',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d472a',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d472c': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d472c',
        shownStatementIds: {
          '68587e7595bf3df6846d472d': { rank: 0, author: true },
          '68587e7595bf3df6846d471b': { rank: 0 },
          '68587e7595bf3df6846d470f': { rank: 0 },
          '68587e7595bf3df6846d46cf': { rank: 0 },
          '68587e7595bf3df6846d46f3': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d472c',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d472c',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d472e': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d472e',
        shownStatementIds: {
          '68587e7595bf3df6846d472f': { rank: 0, author: true },
          '68587e7595bf3df6846d471b': { rank: 0 },
          '68587e7595bf3df6846d470f': { rank: 0 },
          '68587e7595bf3df6846d46cf': { rank: 0 },
          '68587e7595bf3df6846d46f3': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d472e',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d472e',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4730': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4730',
        shownStatementIds: {
          '68587e7595bf3df6846d4731': { rank: 0, author: true },
          '68587e7595bf3df6846d471b': { rank: 0 },
          '68587e7595bf3df6846d470f': { rank: 0 },
          '68587e7595bf3df6846d46cf': { rank: 0 },
          '68587e7595bf3df6846d46f3': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4730',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4730',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4732': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4732',
        shownStatementIds: {
          '68587e7595bf3df6846d4733': { rank: 0, author: true },
          '68587e7595bf3df6846d471b': { rank: 0 },
          '68587e7595bf3df6846d470f': { rank: 0 },
          '68587e7595bf3df6846d46cf': { rank: 0 },
          '68587e7595bf3df6846d46f3': { rank: 1 },
        },
        groupings: [['68587e7595bf3df6846d46cf', '68587e7595bf3df6846d4733']],
      },
      1: {
        userId: '68587e7595bf3df6846d4732',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4732',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4734': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4734',
        shownStatementIds: {
          '68587e7595bf3df6846d4735': { rank: 0, author: true },
          '68587e7595bf3df6846d471b': { rank: 0 },
          '68587e7595bf3df6846d470f': { rank: 0 },
          '68587e7595bf3df6846d46cf': { rank: 0 },
          '68587e7595bf3df6846d46f3': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4734',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4734',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4736': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4736',
        shownStatementIds: {
          '68587e7595bf3df6846d4737': { rank: 0, author: true },
          '68587e7595bf3df6846d4719': { rank: 0 },
          '68587e7595bf3df6846d4723': { rank: 0 },
          '68587e7595bf3df6846d4725': { rank: 1 },
          '68587e7595bf3df6846d471f': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4736',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4736',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4738': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4738',
        shownStatementIds: {
          '68587e7595bf3df6846d4739': { rank: 0, author: true },
          '68587e7595bf3df6846d4719': { rank: 0 },
          '68587e7595bf3df6846d4723': { rank: 0 },
          '68587e7595bf3df6846d4725': { rank: 1 },
          '68587e7595bf3df6846d471f': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4738',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4738',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d473a': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d473a',
        shownStatementIds: {
          '68587e7595bf3df6846d473b': { rank: 0, author: true },
          '68587e7595bf3df6846d4719': { rank: 0 },
          '68587e7595bf3df6846d4723': { rank: 0 },
          '68587e7595bf3df6846d4725': { rank: 1 },
          '68587e7595bf3df6846d471f': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d473a',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d473a',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d473c': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d473c',
        shownStatementIds: {
          '68587e7595bf3df6846d473d': { rank: 0, author: true },
          '68587e7595bf3df6846d4719': { rank: 0 },
          '68587e7595bf3df6846d4723': { rank: 0 },
          '68587e7595bf3df6846d4725': { rank: 1 },
          '68587e7595bf3df6846d471f': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d473c',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d473c',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d473e': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d473e',
        shownStatementIds: {
          '68587e7595bf3df6846d473f': { rank: 0, author: true },
          '68587e7595bf3df6846d4719': { rank: 0 },
          '68587e7595bf3df6846d4723': { rank: 0 },
          '68587e7595bf3df6846d4725': { rank: 1 },
          '68587e7595bf3df6846d471f': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d473e',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d473e',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4740': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4740',
        shownStatementIds: {
          '68587e7595bf3df6846d4741': { rank: 0, author: true },
          '68587e7595bf3df6846d4703': { rank: 1 },
          '68587e7595bf3df6846d4739': { rank: 0 },
          '68587e7595bf3df6846d46dd': { rank: 0 },
          '68587e7595bf3df6846d46c5': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4740',
        shownStatementIds: { '68587e7595bf3df6846d46e3': { rank: 0 }, '68587e7595bf3df6846d46df': { rank: 0 }, '68587e7595bf3df6846d4705': { rank: 0 }, '68587e7595bf3df6846d4691': { rank: 1 }, '68587e7595bf3df6846d46e7': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4740',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4742': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4742',
        shownStatementIds: {
          '68587e7595bf3df6846d4743': { rank: 0, author: true },
          '68587e7595bf3df6846d4703': { rank: 1 },
          '68587e7595bf3df6846d4739': { rank: 0 },
          '68587e7595bf3df6846d46dd': { rank: 0 },
          '68587e7595bf3df6846d46c5': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4742',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4742',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4744': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4744',
        shownStatementIds: {
          '68587e7595bf3df6846d4745': { rank: 0, author: true },
          '68587e7595bf3df6846d4703': { rank: 1 },
          '68587e7595bf3df6846d4739': { rank: 0 },
          '68587e7595bf3df6846d46dd': { rank: 0 },
          '68587e7595bf3df6846d46c5': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4744',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4744',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4746': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4746',
        shownStatementIds: {
          '68587e7595bf3df6846d4747': { rank: 0, author: true },
          '68587e7595bf3df6846d4703': { rank: 1 },
          '68587e7595bf3df6846d4739': { rank: 0 },
          '68587e7595bf3df6846d46dd': { rank: 0 },
          '68587e7595bf3df6846d46c5': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4746',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4746',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4748': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4748',
        shownStatementIds: {
          '68587e7595bf3df6846d4749': { rank: 0, author: true },
          '68587e7595bf3df6846d4703': { rank: 1 },
          '68587e7595bf3df6846d4739': { rank: 0 },
          '68587e7595bf3df6846d46dd': { rank: 0 },
          '68587e7595bf3df6846d46c5': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4748',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4748',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d474a': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d474a',
        shownStatementIds: {
          '68587e7595bf3df6846d474b': { rank: 0, author: true },
          '68587e7595bf3df6846d4749': { rank: 0 },
          '68587e7595bf3df6846d471d': { rank: 0 },
          '68587e7595bf3df6846d472b': { rank: 0 },
          '68587e7595bf3df6846d4729': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d474a',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d474a',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d474c': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d474c',
        shownStatementIds: {
          '68587e7595bf3df6846d474d': { rank: 0, author: true },
          '68587e7595bf3df6846d4749': { rank: 0 },
          '68587e7595bf3df6846d471d': { rank: 0 },
          '68587e7595bf3df6846d472b': { rank: 0 },
          '68587e7595bf3df6846d4729': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d474c',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d474c',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d474e': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d474e',
        shownStatementIds: {
          '68587e7595bf3df6846d474f': { rank: 1, author: true },
          '68587e7595bf3df6846d4749': { rank: 0 },
          '68587e7595bf3df6846d471d': { rank: 0 },
          '68587e7595bf3df6846d472b': { rank: 0 },
          '68587e7595bf3df6846d4729': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d474e',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d474e',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4750': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4750',
        shownStatementIds: {
          '68587e7595bf3df6846d4751': { rank: 0, author: true },
          '68587e7595bf3df6846d4749': { rank: 0 },
          '68587e7595bf3df6846d471d': { rank: 0 },
          '68587e7595bf3df6846d472b': { rank: 0 },
          '68587e7595bf3df6846d4729': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4750',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4750',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4752': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4752',
        shownStatementIds: {
          '68587e7595bf3df6846d4753': { rank: 1, author: true },
          '68587e7595bf3df6846d4749': { rank: 0 },
          '68587e7595bf3df6846d471d': { rank: 0 },
          '68587e7595bf3df6846d472b': { rank: 0 },
          '68587e7595bf3df6846d4729': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4752',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4752',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4754': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4754',
        shownStatementIds: {
          '68587e7595bf3df6846d4755': { rank: 0, author: true },
          '68587e7595bf3df6846d4733': { rank: 0 },
          '68587e7595bf3df6846d4709': { rank: 0 },
          '68587e7595bf3df6846d4727': { rank: 0 },
          '68587e7595bf3df6846d470b': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4754',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4754',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4756': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4756',
        shownStatementIds: {
          '68587e7595bf3df6846d4757': { rank: 0, author: true },
          '68587e7595bf3df6846d4733': { rank: 0 },
          '68587e7595bf3df6846d4709': { rank: 0 },
          '68587e7595bf3df6846d4727': { rank: 0 },
          '68587e7595bf3df6846d470b': { rank: 1 },
        },
        groupings: [['68587e7595bf3df6846d4733', '68587e7595bf3df6846d4757']],
      },
      1: {
        userId: '68587e7595bf3df6846d4756',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4756',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4758': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4758',
        shownStatementIds: {
          '68587e7595bf3df6846d4759': { rank: 0, author: true },
          '68587e7595bf3df6846d4733': { rank: 0 },
          '68587e7595bf3df6846d4709': { rank: 0 },
          '68587e7595bf3df6846d4727': { rank: 0 },
          '68587e7595bf3df6846d470b': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4758',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4758',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d475a': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d475a',
        shownStatementIds: {
          '68587e7595bf3df6846d475b': { rank: 1, author: true },
          '68587e7595bf3df6846d4733': { rank: 0 },
          '68587e7595bf3df6846d4709': { rank: 0 },
          '68587e7595bf3df6846d4727': { rank: 0 },
          '68587e7595bf3df6846d470b': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d475a',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d475a',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d475c': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d475c',
        shownStatementIds: {
          '68587e7595bf3df6846d475d': { rank: 1, author: true },
          '68587e7595bf3df6846d4733': { rank: 0 },
          '68587e7595bf3df6846d4709': { rank: 0 },
          '68587e7595bf3df6846d4727': { rank: 0 },
          '68587e7595bf3df6846d470b': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d475c',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d475c',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d475e': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d475e',
        shownStatementIds: {
          '68587e7595bf3df6846d475f': { rank: 1, author: true },
          '68587e7595bf3df6846d4747': { rank: 0 },
          '68587e7595bf3df6846d472f': { rank: 0 },
          '68587e7595bf3df6846d4717': { rank: 0 },
          '68587e7595bf3df6846d4745': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d475e',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d475e',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4760': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4760',
        shownStatementIds: {
          '68587e7595bf3df6846d4761': { rank: 1, author: true },
          '68587e7595bf3df6846d4747': { rank: 0 },
          '68587e7595bf3df6846d472f': { rank: 0 },
          '68587e7595bf3df6846d4717': { rank: 0 },
          '68587e7595bf3df6846d4745': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4760',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4760',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4762': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4762',
        shownStatementIds: {
          '68587e7595bf3df6846d4763': { rank: 0, author: true },
          '68587e7595bf3df6846d4747': { rank: 0 },
          '68587e7595bf3df6846d472f': { rank: 0 },
          '68587e7595bf3df6846d4717': { rank: 1 },
          '68587e7595bf3df6846d4745': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4762',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4762',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4764': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4764',
        shownStatementIds: {
          '68587e7595bf3df6846d4765': { rank: 0, author: true },
          '68587e7595bf3df6846d4747': { rank: 0 },
          '68587e7595bf3df6846d472f': { rank: 0 },
          '68587e7595bf3df6846d4717': { rank: 1 },
          '68587e7595bf3df6846d4745': { rank: 0 },
        },
        groupings: [['68587e7595bf3df6846d4717', '68587e7595bf3df6846d4765']],
      },
      1: {
        userId: '68587e7595bf3df6846d4764',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4764',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4766': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4766',
        shownStatementIds: {
          '68587e7595bf3df6846d4767': { rank: 1, author: true },
          '68587e7595bf3df6846d4747': { rank: 0 },
          '68587e7595bf3df6846d472f': { rank: 0 },
          '68587e7595bf3df6846d4717': { rank: 0 },
          '68587e7595bf3df6846d4745': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4766',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4766',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4768': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4768',
        shownStatementIds: {
          '68587e7595bf3df6846d4769': { rank: 0, author: true },
          '68587e7595bf3df6846d475b': { rank: 1 },
          '68587e7595bf3df6846d4737': { rank: 0 },
          '68587e7595bf3df6846d474d': { rank: 0 },
          '68587e7595bf3df6846d4721': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4768',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4768',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d476a': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d476a',
        shownStatementIds: {
          '68587e7595bf3df6846d476b': { rank: 0, author: true },
          '68587e7595bf3df6846d475b': { rank: 1 },
          '68587e7595bf3df6846d4737': { rank: 0 },
          '68587e7595bf3df6846d474d': { rank: 0 },
          '68587e7595bf3df6846d4721': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d476a',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d476a',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d476c': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d476c',
        shownStatementIds: {
          '68587e7595bf3df6846d476d': { rank: 0, author: true },
          '68587e7595bf3df6846d475b': { rank: 1 },
          '68587e7595bf3df6846d4737': { rank: 0 },
          '68587e7595bf3df6846d474d': { rank: 0 },
          '68587e7595bf3df6846d4721': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d476c',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d476c',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d476e': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d476e',
        shownStatementIds: {
          '68587e7595bf3df6846d476f': { rank: 0, author: true },
          '68587e7595bf3df6846d475b': { rank: 1 },
          '68587e7595bf3df6846d4737': { rank: 0 },
          '68587e7595bf3df6846d474d': { rank: 0 },
          '68587e7595bf3df6846d4721': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d476e',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d476e',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4770': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4770',
        shownStatementIds: {
          '68587e7595bf3df6846d4771': { rank: 0, author: true },
          '68587e7595bf3df6846d475b': { rank: 1 },
          '68587e7595bf3df6846d4737': { rank: 0 },
          '68587e7595bf3df6846d474d': { rank: 0 },
          '68587e7595bf3df6846d4721': { rank: 0 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4770',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4770',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4772': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4772',
        shownStatementIds: {
          '68587e7595bf3df6846d4773': { rank: 0, author: true },
          '68587e7595bf3df6846d474f': { rank: 0 },
          '68587e7595bf3df6846d473d': { rank: 0 },
          '68587e7595bf3df6846d46d1': { rank: 0 },
          '68587e7595bf3df6846d4771': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4772',
        shownStatementIds: { '68587e7595bf3df6846d4725': { rank: 1 }, '68587e7595bf3df6846d4703': { rank: 0 }, '68587e7595bf3df6846d46fb': { rank: 0 }, '68587e7595bf3df6846d46f3': { rank: 0 }, '68587e7595bf3df6846d46e9': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4772',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
  '68587e7595bf3df6846d4774': {
    1: {
      0: {
        userId: '68587e7595bf3df6846d4774',
        shownStatementIds: {
          '68587e7595bf3df6846d4775': { rank: 0, author: true },
          '68587e7595bf3df6846d474f': { rank: 0 },
          '68587e7595bf3df6846d473d': { rank: 0 },
          '68587e7595bf3df6846d46d1': { rank: 0 },
          '68587e7595bf3df6846d4771': { rank: 1 },
        },
        groupings: [],
      },
      1: {
        userId: '68587e7595bf3df6846d4774',
        shownStatementIds: { '68587e7595bf3df6846d4771': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 1 }, '68587e7595bf3df6846d4717': { rank: 0 }, '68587e7595bf3df6846d4729': { rank: 0 }, '68587e7595bf3df6846d470b': { rank: 0 } },
        groupings: [],
      },
      2: {
        userId: '68587e7595bf3df6846d4774',
        shownStatementIds: { '68587e7595bf3df6846d46a5': { rank: 1 }, '68587e7595bf3df6846d4691': { rank: 0 }, '68587e7595bf3df6846d4677': { rank: 0 }, '68587e7595bf3df6846d4725': { rank: 0 }, '68587e7595bf3df6846d475b': { rank: 0 } },
        groupings: [['68587e7595bf3df6846d4725', '68587e7595bf3df6846d475b']],
      },
    },
  },
}
