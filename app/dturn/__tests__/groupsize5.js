//https://github.com/EnCiv/civil-pursuit/issues/328
const { initDiscussion, Discussions, getStatementIds, insertStatementId } = require('../dturn')

const dturnInfo = [
  {
    _id: {
      $oid: '67f58c2eccabd0294191aa9b',
    },
    discussionId: '67db9da4c6019fba8de3eafe',
    round: '0',
    userId: '67f413bd872c90a8464b0b9d',
    groupings: [],
    shownStatementIds: {
      '67f59b566f212afb10e9ef28': {
        rank: 0,
        author: true,
      },
    },
  },
  {
    _id: {
      $oid: '67f6cd56ccabd0294191af3d',
    },
    round: '0',
    discussionId: '67db9da4c6019fba8de3eafe',
    userId: '67f6c56e043c6ab28bc5d320',
    groupings: [],
    shownStatementIds: {
      '67f9f277efe13638a8d0cef8': {
        rank: 0,
        author: true,
      },
    },
  },
  {
    _id: {
      $oid: '67fd50a54c0038edaad70dd2',
    },
    userId: '67fd5065261cb1239a01c90d',
    round: '0',
    discussionId: '67db9da4c6019fba8de3eafe',
    groupings: [],
    shownStatementIds: {
      '67fead10b48d8446c4bb2c23': {
        rank: 0,
        author: true,
      },
    },
  },
  {
    _id: {
      $oid: '67ff17ab4c0038edaad717ef',
    },
    userId: '67ff14d01931dba30fc8707f',
    round: '0',
    discussionId: '67db9da4c6019fba8de3eafe',
    groupings: [],
    shownStatementIds: {
      '67ff178d65ed58e573ba4da6': {
        rank: 0,
        author: true,
      },
    },
  },
  {
    _id: {
      $oid: '67ff1bdf4c0038edaad71805',
    },
    userId: '67ff18731931dba30fc8708e',
    discussionId: '67db9da4c6019fba8de3eafe',
    round: '0',
    groupings: [],
    shownStatementIds: {
      '67ff1bd19a9c1f7f94d2fe17': {
        rank: 0,
        author: true,
      },
    },
  },
  {
    _id: {
      $oid: '67ff25394c0038edaad7182d',
    },
    discussionId: '67db9da4c6019fba8de3eafe',
    round: '0',
    userId: '67ff1c59a5748c1dc14196d5',
    groupings: [],
    shownStatementIds: {
      '67ff252636272a92d4d46725': {
        rank: 0,
        author: true,
      },
    },
  },
  {
    _id: {
      $oid: '67ff25954c0038edaad7182f',
    },
    discussionId: '67db9da4c6019fba8de3eafe',
    round: '0',
    userId: '67ff256fbeb3d5ac4ad07be2',
    groupings: [],
    shownStatementIds: {
      '67ff25895bd485f67b6229cb': {
        rank: 0,
        author: true,
      },
    },
  },
  {
    _id: {
      $oid: '67ff26344c0038edaad71832',
    },
    discussionId: '67db9da4c6019fba8de3eafe',
    round: '0',
    userId: '67ff261abeb3d5ac4ad07bfa',
    groupings: [],
    shownStatementIds: {
      '67ff262110d0fd1ed6e3fa83': {
        rank: 0,
        author: true,
      },
    },
  },
  {
    _id: {
      $oid: '67ff26894c0038edaad71833',
    },
    userId: '67ff266fbeb3d5ac4ad07c06',
    round: '0',
    discussionId: '67db9da4c6019fba8de3eafe',
    groupings: [],
    shownStatementIds: {
      '67ff2678f52a35d336714939': {
        rank: 0,
        author: true,
      },
    },
  },
  {
    _id: {
      $oid: '681a8cae97a38753df01aec2',
    },
    userId: '67ff26c3beb3d5ac4ad07c12',
    discussionId: '67db9da4c6019fba8de3eafe',
    round: 0,
    shownStatementIds: {
      '6826600167900b50f6f39298': {
        rank: 0,
        author: true,
      },
      '67f9f277efe13638a8d0cef8': {
        rank: 0,
      },
      '67ff178d65ed58e573ba4da6': {
        rank: 0,
      },
      '67ff25895bd485f67b6229cb': {
        rank: 0,
      },
      '67ff2678f52a35d336714939': {
        rank: 0,
      },
    },
    groupings: [['67f9f277efe13638a8d0cef8', '67ff178d65ed58e573ba4da6']],
  },
  {
    _id: {
      $oid: '682237039e3ad9216ff58b53',
    },
    round: 0,
    discussionId: '67db9da4c6019fba8de3eafe',
    userId: '682236cdf99603f352237c15',
    shownStatementIds: {
      '682236d65c9cbaa5f0e38c5a': {
        author: true,
        rank: 0,
      },
      '67f9f277efe13638a8d0cef8': {
        rank: 0,
      },
      '67ff178d65ed58e573ba4da6': {
        rank: 0,
      },
      '67ff25895bd485f67b6229cb': {
        rank: 0,
      },
      '67ff2678f52a35d336714939': {
        rank: 0,
      },
    },
    groupings: {
      0: {
        0: '67f9f277efe13638a8d0cef8',
        1: '67ff25895bd485f67b6229cb',
      },
    },
  },
  {
    _id: {
      $oid: '6826be35ab379895567683f8',
    },
    discussionId: '67db9da4c6019fba8de3eafe',
    userId: '6826bc8a47f81ef9b4358606',
    round: 0,
    groupings: [],
    shownStatementIds: {
      '6826bc9ebce09d6877d03841': {
        rank: 0,
        author: true,
      },
      '67f9f277efe13638a8d0cef8': {
        rank: 0,
      },
      '67ff178d65ed58e573ba4da6': {
        rank: 0,
      },
      '67ff25895bd485f67b6229cb': {
        rank: 0,
      },
      '67ff2678f52a35d336714939': {
        rank: 0,
      },
    },
  },
  {
    _id: {
      $oid: '682f876cd73f68a0ca197ce9',
    },
    discussionId: '67db9da4c6019fba8de3eafe',
    round: 0,
    userId: '682f874acaa10cd6ffa80a55',
    groupings: [['67f9f277efe13638a8d0cef8', '682f8759947b47754448d755', '67ff178d65ed58e573ba4da6']],
    shownStatementIds: {
      '682f8759947b47754448d755': {
        rank: 0,
        author: true,
      },
      '67f9f277efe13638a8d0cef8': {
        rank: 1,
      },
      '67ff178d65ed58e573ba4da6': {
        rank: 0,
      },
      '67ff25895bd485f67b6229cb': {
        rank: 0,
      },
      '67ff2678f52a35d336714939': {
        rank: 0,
      },
    },
  },
  {
    _id: {
      $oid: '68374c6cd73f68a0ca19af71',
    },
    discussionId: '67db9da4c6019fba8de3eafe',
    round: 0,
    userId: '68374c4b5adc6a02b68d544d',
    groupings: [['67ff25895bd485f67b6229cb', '67ff2678f52a35d336714939', '68374c5a0c2e4d34d073799e']],
    shownStatementIds: {
      '68374c5a0c2e4d34d073799e': {
        rank: 0,
        author: true,
      },
      '67f9f277efe13638a8d0cef8': {
        rank: 1,
      },
      '67ff178d65ed58e573ba4da6': {
        rank: 0,
      },
      '67ff25895bd485f67b6229cb': {
        rank: 0,
      },
      '67ff2678f52a35d336714939': {
        rank: 0,
      },
    },
  },
  /*
  {
    _id: {
      $oid: '68474a9a850de2263acb2536',
    },
    discussionId: '67db9da4c6019fba8de3eafe',
    round: 0,
    userId: '669ae5dac54191a5cc5846ce',
    groupings: [],
    shownStatementIds: {
      '684749d2a04ac0dd7b295950': {
        rank: 0,
        author: true,
      },
    },
  },*/
]

const DISCUSSION_ID = '67db9da4c6019fba8de3eafe'
const USERID = '669ae5dac54191a5cc5846ce'
const OPTIONS = {
  group_size: 5,
  gmajority: 0.5,
  max_rounds: 10,
  min_shown_count: 6,
  min_rank: 3,
  updateUInfo: async () => {}, //uInfo => console.log('updateUInfo', JSON.stringify(uInfo, null, 2)),
  getAllUInfo: async () => {
    const all = dturnInfo.map(({ discussionId, userId, round, shownStatementIds = {}, groupings = [] }) => ({
      [userId]: {
        [discussionId]: {
          [round]: {
            shownStatementIds,
            groupings: Object.values(groupings).map(group => Object.values(group)), // convert from plain object with nested objects to array of arrays
          },
        },
      },
    }))
    return all
  },
}

describe('Initialize Discussion', () => {
  test('initialize discussion', async () => {
    await initDiscussion(DISCUSSION_ID, OPTIONS)
    await insertStatementId(DISCUSSION_ID, USERID, '684749d2a04ac0dd7b295950')
    const statementIds = await getStatementIds(DISCUSSION_ID, 0, USERID)
    expect(statementIds.length).toBe(5)
  })

  test('can do it 100 times and always get the right number of statements', async () => {
    for (let i = 0; i < 100; i++) {
      await initDiscussion(DISCUSSION_ID, OPTIONS)
      await insertStatementId(DISCUSSION_ID, USERID, '684749d2a04ac0dd7b295950')
      const statementIds = await getStatementIds(DISCUSSION_ID, 0, USERID)
      expect(statementIds.length).toBe(5)
      expect(new Set(statementIds).size).toBe(5) // all elements should be unique
      delete Discussions[DISCUSSION_ID]
    }
  })
})
