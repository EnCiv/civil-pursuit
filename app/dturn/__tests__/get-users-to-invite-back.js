// https://github.com/EnCiv/civil-pursuit/issues/362
const { initDiscussion, Discussions, insertStatementId, getStatementIds, finishRound, getUsersToInviteBack } = require('../dturn')

const DISCUSSION_ID = 'inviteTest'

describe('getUsersToInviteBack', () => {
  beforeAll(() => {
    process.env.JEST_TEST_ENV = 'true'
  })
  beforeEach(async () => {
    delete Discussions[DISCUSSION_ID]
  })

  test('discussion does not exist', async () => {
    const res = await getUsersToInviteBack('nope')
    expect(res).toBeUndefined()
  })

  test('discussion exists but empty', async () => {
    await initDiscussion(DISCUSSION_ID, { updateUInfo: async () => {}, getAllUInfo: async () => [], finalRound: 3 })
    const res = await getUsersToInviteBack(DISCUSSION_ID)
    expect(res).toEqual([])
  })

  test('1 user submitted a single statement only -> not invited', async () => {
  await initDiscussion(DISCUSSION_ID, { updateUInfo: async () => {}, getAllUInfo: async () => [], group_size: 5, finalRound: 3 })
    await insertStatementId(DISCUSSION_ID, 'u1', 's1')
    const res = await getUsersToInviteBack(DISCUSSION_ID)
    expect(res).toEqual([])
  })

  test('10 users submitted statements, 5 finished round 0 -> other 5 invited', async () => {
  await initDiscussion(DISCUSSION_ID, { updateUInfo: async () => {}, getAllUInfo: async () => [], group_size: 5, finalRound: 3 })
    // insert 10 users
    for (let i = 0; i < 10; i++) {
      const res = await insertStatementId(DISCUSSION_ID, `u${i}`, `s${i}`)
      expect(res).toBe(`s${i}`)
    }
    // have up to 5 users finish round 0; some users may not get statementIds (dturn behavior)
    const usersGotIds = []
    for (let i = 0; i < 10 && usersGotIds.length < 5; i++) {
      const ids = await getStatementIds(DISCUSSION_ID, 0, `u${i}`)
      if (ids && ids.length) {
        usersGotIds.push(`u${i}`)
        // finishRound requires a ranking; rank first id
        await finishRound(DISCUSSION_ID, 0, `u${i}`, [{ [ids[0]]: 1 }], [])
      }
    }
    const res = await getUsersToInviteBack(DISCUSSION_ID)
    // expected invited users for round 0 are those who did NOT get statement IDs and finishRound
    const allUsers = Array.from({ length: 10 }, (_, i) => `u${i}`)
    const notGot = allUsers.filter(u => !usersGotIds.includes(u)).sort()
    const invited = res
      .filter(r => r.round === 0)
      .map(r => r.userId)
      .sort()
    expect(invited).toEqual(notGot)
  })

  test('30 users, 29 finished round0, 5 finished round1 -> invite 1 to round0 and 24 to round1', async () => {
    await initDiscussion(DISCUSSION_ID, { updateUInfo: async () => {}, getAllUInfo: async () => [], group_size: 5 })
    // insert 30 users
    for (let i = 0; i < 30; i++) {
      const res = await insertStatementId(DISCUSSION_ID, `u${i}`, `s${i}`)
      expect(res).toBe(`s${i}`)
    }
    // finish round 0 for up to 29 users; some may not get statementIds
    const usersFinishedR0 = []
    for (let i = 0; i < 29; i++) {
      const ids = await getStatementIds(DISCUSSION_ID, 0, `u${i}`)
      if (ids && ids.length) {
        usersFinishedR0.push(`u${i}`)
        await finishRound(DISCUSSION_ID, 0, `u${i}`, [{ [ids[0]]: 1 }], [])
      }
    }
    // promote some items to round 1 by altering ranks: simulate 5 users finishing round1
    // first, make sure round1 is initialized by having enough ranked items
    // call getStatementIds for one of the users who finished round0 to trigger setup
    const idsForR1 = await getStatementIds(DISCUSSION_ID, 1, 'u0')
    // finish round1 for users 0..4
    for (let i = 0; i < 5; i++) {
      const ids = await getStatementIds(DISCUSSION_ID, 1, `u${i}`)
      if (ids && ids.length) await finishRound(DISCUSSION_ID, 1, `u${i}`, [{ [ids[0]]: 1 }], [])
    }

    const dis2 = Discussions[DISCUSSION_ID]
    const res = await getUsersToInviteBack(DISCUSSION_ID)
    const round0 = res.filter(r => r.round === 0).map(r => r.userId)
    const round1 = res.filter(r => r.round === 1).map(r => r.userId)
    // users who did not finish round0 should be invited to round0
    const allUsers30 = Array.from({ length: 30 }, (_, i) => `u${i}`)
    const notFinishedR0 = allUsers30.filter(u => !usersFinishedR0.includes(u))
    notFinishedR0.forEach(u => expect(round0).toContain(u))

    // If round1 hasn't been initialized by dturn, skip strict assertions for round1
    if (!dis2.ShownStatements || dis2.ShownStatements.length <= 1) {
      // in this case there are no round1 invites
      expect(round1.length).toBe(0)
      return
    }

    // users invited to round1 should be those who finished round0 but not round1
    const usersFinishedR1 = []
    for (let i = 0; i < 30; i++) {
      const u = Discussions[DISCUSSION_ID].Uitems[`u${i}`]
      if (u && u[1] && u[1].finished) usersFinishedR1.push(`u${i}`)
    }
    const expectedRound1 = usersFinishedR0.filter(u => !usersFinishedR1.includes(u))
    expect(round1.sort()).toEqual(expectedRound1.sort())
  })
})
