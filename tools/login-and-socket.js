// Usage: node login-and-socket.js <url> <email> <password>
// Logs in to the given URL at /sign/in, extracts the auth cookie, and demonstrates using it in a socket.io connection.

const { io } = require('socket.io-client')
const fetch = require('node-fetch')
const { Mongo } = require('@enciv/mongo-collections')
const { User } = require('civil-server')
const ObjectId = require('bson-objectid')

async function loginAndGetCookie(url, email, password) {
  let loginUrl = url.replace(/\/$/, '') + '/sign/in'
  console.log(`Logging in to ${loginUrl} with email: ${email}`)
  const res = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    redirect: 'manual',
  })
  if (!res.ok) {
    const text = await res.text()
    console.error('Login failed:', res.status, text)
    return null
  }
  const setCookie = res.headers.raw()['set-cookie']
  if (!setCookie || !setCookie.length) {
    console.error('No set-cookie header received.')
    return null
  }
  // Find the synuser cookie
  const synuserCookie = setCookie.find(c => c.startsWith('synuser='))
  if (!synuserCookie) {
    console.error('No synuser cookie received.')
    return null
  }
  // Only use the synuser cookie for socket.io authentication
  const cookie = synuserCookie.split(';')[0]
  return cookie
}

async function answer(context) {
  const socket = context.socket
  const userId = context.userId
  const deliberationId = context.deliberationId
  // Get round and uInfo from context (from subscribe-deliberation)
  const { round, uInfo } = context.subscribeDeliberationResult || {}
  if (typeof round !== 'number' || !uInfo) {
    console.error('No round or uInfo in context for answer step.')
    return
  }
  if (round !== 0) {
    console.log('Not round 0, skipping answer step.')
    return
  }
  // Find this user's info
  const userInfo = uInfo.find(u => u.userId === userId)
  if (!userInfo) {
    console.error('No user info found for userId', userId)
    return
  }
  const shownStatementIds = Object.keys(userInfo.shownStatementIds || {})

  // Fetch current points and whys
  let points = [],
    myWhys = []
  if (shownStatementIds.length > 0) {
    const getPointsOfIds = ids =>
      new Promise(resolve => {
        socket.emit('get-points-of-ids', ids, ({ points, myWhys }) => {
          context.points = points
          context.myWhys = myWhys
          resolve({ points, myWhys })
        })
      })
    const result = await getPointsOfIds(shownStatementIds)
    points = result.points || []
    myWhys = result.myWhys || []
  }
  // Check if user already has an answer and why for this round
  const myAnswer = points.find(p => p.userId === userId)
  const myWhy = myWhys.find(w => w.userId === userId && w.parentId === (myAnswer && myAnswer._id))
  if (myAnswer && myWhy) {
    console.log('User already has an answer and why for round 0, skipping.')
    return
  }
  // Generate answer and why
  let answerValue
  let answerObj
  if (myAnswer && myAnswer.subject) {
    answerValue = myAnswer.subject
    answerObj = myAnswer
  } else {
    answerValue = Math.floor(Math.random() * 101).toString()
    answerObj = {
      _id: ObjectId().toString(),
      parentId: deliberationId,
      userId,
      subject: answerValue.toString(),
      description: answerValue.toString(),
    }
  }
  // Only generate whyObj if needed
  const whyValue = Math.floor(Math.random() * (parseInt(answerValue, 10) + 1))
  const whyText = `${answerValue} > ${whyValue}`
  const whyObj = {
    _id: ObjectId().toString(),
    parentId: answerObj._id,
    userId,
    category: 'most',
    subject: whyText,
    description: whyText,
  }
  // Submit answer and why
  await new Promise(resolve => {
    if (!myAnswer) {
      socket.emit('insert-dturn-statement', answerObj.parentId, answerObj, () => {
        socket.emit('upsert-why', whyObj, () => {
          console.log('Submitted answer and why:', answerObj, whyObj)
          resolve()
        })
      })
    } else if (!myWhy) {
      socket.emit('upsert-why', whyObj, () => {
        console.log('Submitted why for existing answer:', whyObj)
        resolve()
      })
    } else {
      resolve()
    }
  })
  // Retain for later use
  context.myAnswer = answerObj
  context.myWhy = whyObj
}

async function group(context) {
  const socket = context.socket
  const deliberationId = context.deliberationId
  // Get points for this round
  const round = (context.subscribeDeliberationResult && context.subscribeDeliberationResult.round) || 0
  const getPointsForRound = () =>
    new Promise(resolve => {
      socket.emit('get-points-for-round', deliberationId, round, result => {
        resolve(result)
      })
    })
  const points = await getPointsForRound()
  context.pointsForRound = points
  if (!points?.length) {
    console.log('Group, No points to group found for round', round)
    return
  }
  // Group points by subject
  const groupMap = {}
  for (const point of points) {
    if (!groupMap[point.subject]) groupMap[point.subject] = []
    groupMap[point.subject].push(point._id)
  }
  const groupings = Object.values(groupMap).filter(arr => arr.length > 1)
  context.groupings = groupings
  // Emit post-point-groups
  console.log('Posting point groups:', groupings)
  await new Promise(resolve => {
    socket.emit('post-point-groups', deliberationId, round, groupings, () => {
      resolve()
    })
  })
}

async function subscribe(url, cookie, context) {
  return new Promise(resolve => {
    const socket = io(url, {
      extraHeaders: {
        Cookie: cookie,
      },
    })
    socket.on('connect', () => {
      console.log('Socket.io connected with cookie authentication!')
    })
    socket.on('connect_error', err => {
      console.error('Socket.io connection error:', err.message)
      process.exit(1)
    })
    socket.on('welcome', data => {
      console.log('Received welcome message:', data)
    })
    socket.on('online users', count => {
      console.log('Online users count:', count)
      if (context.deliberationId) {
        console.log('Subscribing to deliberation:', context.deliberationId)
        socket.emit('subscribe-deliberation', context.deliberationId, async result => {
          console.log('subscribe-deliberation result:', JSON.stringify(result, null, 2))
          context.subscribeDeliberationResult = result
          context.socket = socket
          resolve(context)
        })
      } else {
        context.socket = socket
        resolve(context)
      }
    })
  })
}

async function getNextTestUserNumberFromMongo() {
  const users = await User.find({ email: { $regex: /^ga-test-\d+@enciv.org$/ } }).toArray()
  let maxNum = 0
  for (const user of users) {
    const match = /ga-test-(\d+)@enciv.org/.exec(user.email)
    if (match) {
      const num = parseInt(match[1], 10)
      if (num > maxNum) maxNum = num
    }
  }
  return maxNum + 1
}

async function signUpTestUserWithMongo(url) {
  const nextNum = await getNextTestUserNumberFromMongo()
  const email = `ga-test-${nextNum}@enciv.org`
  const password = email.split('').reverse().join('')
  const payload = {
    email,
    password,
    firstName: email,
    lastName: email,
  }
  const signUpUrl = url.replace(/\/$/, '') + '/sign/up'
  console.log(`signupUrl: ${signUpUrl}, payload: ${JSON.stringify(payload)}`)
  const res = await fetch(signUpUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    console.error('Sign up failed:', res.status, res.statusText)
    const text = await res.text()
    throw new Error('Sign up failed: ' + text)
  }
  const result = await res.json()
  return { email, password, userId: result.userId || result._id || result.id }
}

async function closeDown(context) {
  try {
    context.socket.disconnect()
    console.log('Socket disconnected.')
  } catch (e) {
    console.error('Error disconnecting socket:', e)
  }
  // Mongo.disconnect() is now handled in main()
}

async function rank(context) {
  const socket = context.socket
  const deliberationId = context.deliberationId
  // Get points and groupings from context
  const points = context.pointsForRound || []
  const groupings = context.groupings || []
  if (!points.length) {
    context.ranks = []
    console.log('No points to rank, skipping rank step.')
    return
  }
  // Build reducedPoints: ungrouped points + first point of each group
  const groupedIds = new Set(groupings.flat())
  const ungroupedPoints = points.filter(p => !groupedIds.has(p._id))
  const firstOfEachGroup = groupings.map(group => points.find(p => p._id === group[0])).filter(Boolean)
  const reducedPoints = [...ungroupedPoints, ...firstOfEachGroup]
  context.reducedPoints = reducedPoints
  console.log('Reduced points:', JSON.stringify(reducedPoints, null, 2))

  // Get any past ranks
  const userId = context.userId
  const round = (context.subscribeDeliberationResult && context.subscribeDeliberationResult.round) || 0
  const getUserRanks = () =>
    new Promise(resolve => {
      socket.emit('get-user-ranks', deliberationId, round, 'pre', result => {
        resolve(result || [])
      })
    })
  const pastRanks = await getUserRanks()
  context.pastRanks = pastRanks

  // Find 2 largest and 1 smallest points by subject (as number)
  const sorted = [...reducedPoints].sort((a, b) => parseFloat(b.subject) - parseFloat(a.subject))
  const mostPoints = sorted.slice(0, 2)
  const leastPoint = sorted[sorted.length - 1]

  // Build ranks
  const ranks = reducedPoints.map(point => {
    let category = 'neutral'
    if (mostPoints.some(p => p._id === point._id)) category = 'most'
    else if (point._id === leastPoint._id) category = 'least'
    // Find existing rank for this point
    let existing = pastRanks.find(r => r.parentId === point._id)
    if (existing) {
      existing.category = category
      return existing
    } else {
      return {
        _id: ObjectId().toString(),
        stage: 'pre',
        category,
        parentId: point._id,
        round,
        discussionId: deliberationId,
        userId,
      }
    }
  })
  context.ranks = ranks
  // Upsert all ranks
  for (const rankObj of ranks) {
    await new Promise(resolve => {
      socket.emit('upsert-rank', rankObj, () => resolve())
    })
  }
  // Export a list of the point.subject and rank.category
  const summary = reducedPoints.map(point => {
    const rank = ranks.find(r => r.parentId === point._id)
    return { subject: point.subject, category: rank.category }
  })
  context.rankSummary = summary
  console.log('Rank summary:', summary)
}

// Emulate the CompareWhys step logic for test automation
async function compareWhys(context, category) {
  const { socket, deliberationId, userId } = context
  // Get round from context
  const round = (context.subscribeDeliberationResult && context.subscribeDeliberationResult.round) || 0
  // Get mostIds and leastIds from context, or compute from ranks if not present
  let mostIds = context.mostIds,
    leastIds = context.leastIds
  if (!mostIds || !leastIds) {
    // Try to compute from context.pastRanks or context.ranks
    const ranks = context.pastRanks || context.ranks || []
    mostIds = ranks.filter(r => r.category === 'most').map(r => r.parentId)
    leastIds = ranks.filter(r => r.category === 'least').map(r => r.parentId)
  }
  mostIds = mostIds || []
  leastIds = leastIds || []
  // Fetch why ranks and points
  const result = await new Promise(resolve => {
    socket.emit('get-why-ranks-and-points', deliberationId, round, mostIds, leastIds, resolve)
  })
  if (!result) {
    console.error('compareWhys: No result from get-why-ranks-and-points')
    return
  }
  const { ranks = [], whys = [] } = result
  if (whys.length !== mostIds.length + leastIds.length)
    console.error(
      `compareWhys: Expected ${mostIds.length + leastIds.length} whys, but got ${whys.length} there may be missing why's in the points collection.`,
      `Most+LestIds: ${mostIds.concat(leastIds).sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))}, why parentIds: ${whys.map(w => w.parentId).sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))}`
    )
  // Build lookup for existing ranks by parentId
  const rankByParentId = {}
  for (const r of ranks) rankByParentId[r.parentId] = r
  // Group whys by parentId
  const whysByParentId = {}
  for (const why of whys) {
    if (!whysByParentId[why.parentId]) whysByParentId[why.parentId] = []
    whysByParentId[why.parentId].push(why)
  }
  // For each parentId, pick the best why and build ranks
  for (const [parentId, whyList] of Object.entries(whysByParentId)) {
    // Always parse, use 0 if not matching
    const parsedWhys = whyList.map(why => {
      const match = /^(\d+)\s*>\s*(\d+)$/.exec(why.subject)
      if (!match) {
        return { why, xx: 0, yy: 0 }
      }
      return { why, xx: parseInt(match[1], 10), yy: parseInt(match[2], 10) }
    })
    if (!parsedWhys.length) continue
    let bestWhy
    if (category === 'most') {
      // Pick why with largest YY
      bestWhy = parsedWhys.reduce((a, b) => (a.yy > b.yy ? a : b))
    } else if (category === 'least') {
      // Pick why with smallest YY
      bestWhy = parsedWhys.reduce((a, b) => (a.yy < b.yy ? a : b))
    } else {
      continue
    }
    // Upsert ranks: bestWhy is 'most', others are 'neutral'
    for (const { why } of parsedWhys) {
      let categoryVal = why._id === bestWhy.why._id ? 'most' : 'neutral'
      let rank = rankByParentId[why._id]
      if (rank) {
        rank.category = categoryVal
      } else {
        rank = {
          _id: ObjectId(), // always an ObjectId, not a string
          stage: 'why',
          category: categoryVal,
          parentId: why._id,
          round,
          discussionId: deliberationId,
          userId,
        }
      }
      // Upsert rank
      await new Promise(resolve => {
        socket.emit('upsert-rank', rank, resolve)
      })
    }
    for (const { why } of parsedWhys) {
      console.log(`compare whys ${why.subject} rank: ${rankByParentId[why._id]?.category}`)
    }
  }
  console.log('compareWhys: completed for category', category)
}

// Emulate the rerank step logic for test automation
async function rerank(context) {
  const socket = context.socket
  const deliberationId = context.deliberationId
  const userId = context.userId
  const round = (context.subscribeDeliberationResult && context.subscribeDeliberationResult.round) || 0
  const reducedPoints = context.reducedPoints || []
  if (!reducedPoints.length) {
    console.log('No reducedPoints to rerank, skipping rerank step.')
    return
  }
  // Fetch post ranks and top-ranked whys
  const result = await new Promise(resolve => {
    socket.emit(
      'get-user-post-ranks-and-top-ranked-whys',
      deliberationId,
      round,
      reducedPoints.map(p => p._id),
      resolve
    )
  })
  const { ranks: postRanks = [] } = result || {}
  // Find 2 largest and 1 smallest points by subject (as number)
  const sorted = [...reducedPoints].sort((a, b) => parseFloat(b.subject) - parseFloat(a.subject))
  const mostPoints = sorted.slice(0, 2)
  const leastPoint = sorted[sorted.length - 1]
  // Build new ranks
  const newRanks = reducedPoints.map(point => {
    let category = 'neutral'
    if (mostPoints.some(p => p._id === point._id)) category = 'most'
    else if (point._id === leastPoint._id) category = 'least'
    // Find existing post rank for this point
    let existing = postRanks.find(r => r.parentId === point._id)
    if (existing) {
      // Only upsert if the category has changed
      return { ...existing, _shouldUpsert: existing.category !== category, category }
    } else {
      return {
        _id: ObjectId(),
        stage: 'post',
        category,
        parentId: point._id,
        round,
        discussionId: deliberationId,
        userId,
        _shouldUpsert: true,
      }
    }
  })
  // Upsert only if new or category changed
  for (const rankObj of newRanks) {
    if (rankObj._shouldUpsert) {
      const { _shouldUpsert, ...toUpsert } = rankObj
      await new Promise(resolve => {
        socket.emit('upsert-rank', toUpsert, resolve)
      })
    }
  }
  // Build rankByIds as [{[pointId]: number}, ...]
  const rankByIds = reducedPoints.map(point => {
    const rankObj = newRanks.find(r => r.parentId === point._id)
    // Only 'most' is 1, all others are 0
    return { [point._id]: rankObj && rankObj.category === 'most' ? 1 : 0 }
  })
  // Call complete-round with rankByIds
  await new Promise(resolve => {
    socket.emit('complete-round', deliberationId, round, rankByIds, resolve)
  })
  console.log('rerank: completed and round marked complete')
}

async function runForUser(fixedUrl, deliberationId, email, password) {
  let testUser
  let cookie
  const context = {}
  context.deliberationId = deliberationId
  // If email is like ga-test-... and no password is given, use reversed email as password
  if (email && !password && /^ga-test-.*@enciv\.org$/.test(email)) {
    password = email.split('').reverse().join('')
    console.log('Generated password from email')
  }
  if (!email || !password) {
    // No email/password provided, create a test user
    testUser = await signUpTestUserWithMongo(fixedUrl)
    email = testUser.email
    password = testUser.password
    context.userId = testUser.userId
    console.log('Created test user:', email, context.userId)
    cookie = await loginAndGetCookie(fixedUrl, email, password)
  } else {
    // Try to login, if fails, sign up then login
    cookie = await loginAndGetCookie(fixedUrl, email, password)
    if (cookie) {
      console.log('Login successful. Cookie:', cookie)
    } else {
      console.log('Login failed for', email, '- attempting signup.')
      // Try to sign up
      const payload = {
        email,
        password,
        firstName: email,
        lastName: email,
      }
      const signUpUrl = fixedUrl.replace(/\/$/, '') + '/sign/up'
      const res = await fetch(signUpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        console.error('Signup failed for', email, text)
        process.exit(1)
      }
      const result = await res.json()
      context.userId = result.userId || result._id || result.id
      console.log('Signed up user:', email, context.userId)
      // Now login
      cookie = await loginAndGetCookie(fixedUrl, email, password)
      if (!cookie) {
        console.error('Login after signup failed for', email)
        process.exit(1)
      }
    }
    // Extract userId from the synuser cookie (JSON string) if not set
    if (!context.userId) {
      try {
        // cookie is in the form 'synuser=...'
        const decodedCookie = decodeURIComponent(cookie)
        const cookieVal = decodedCookie.split('=')[1]
        // If cookieVal starts with 'j:', remove it
        const cleanVal = cookieVal.startsWith('j:') ? cookieVal.slice(2) : cookieVal
        const cookieObj = JSON.parse(decodeURIComponent(cleanVal))
        context.userId = cookieObj.id
      } catch (e) {
        console.error('Failed to extract userId from cookie:', e)
        process.exit(1)
      }
    }
  }
  console.log('context', context)
  await subscribe(fixedUrl, cookie, context)
  await answer(context)
  await group(context)
  await rank(context)
  await compareWhys(context, 'most')
  await compareWhys(context, 'least')
  await rerank(context)
  await closeDown(context)
}

async function main() {
  let [, , deliberationId, userCountStr] = process.argv
  if (!deliberationId || !userCountStr) {
    console.error('Usage: node login-and-socket.js <deliberationId> <userCount>')
    process.exit(1)
  }
  const userCount = parseInt(userCountStr, 10)
  if (isNaN(userCount) || userCount < 1) {
    console.error('userCount must be a positive integer')
    process.exit(1)
  }
  const url = process.env.CIVIL_SERVER_URL || 'http://127.0.0.1:3012' // localhost doesn't work
  await Mongo.connect()
  try {
    for (let user = 1; user <= userCount; user++) {
      const email = `ga-test-${user}@enciv.org`
      const password = email.split('').reverse().join('')
      console.log(`\n--- Running steps for user ${user}: ${email} ---`)
      await runForUser(url, deliberationId, email, password)
    }
  } finally {
    await Mongo.disconnect()
    console.log('Mongo connection closed.')
  }
}

main()
