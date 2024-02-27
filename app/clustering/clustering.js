const { deepEqual } = require('assert')

// clustering
const GROUP_SIZE = 7 // this is the group size
const GMAJORITY = 0.5 //Group Majority - minimum percentage of group that votes for it to be part of the group
const MAX_ROUNDS = 10 // maximum number of rounds to search down when clustering children
const MIN_SHOWN_COUNT = Math.floor(GROUP_SIZE / 2) + 1 // the minimum number of times a item pair is shown in order to decide if a majority have grouped it
const MIN_RANK = 2 // when filterning statements for the next round, they must at least have this number of users voting for it
/**
 *  initDiscussion(discussionId,options) nothing returned
 *  insertStatementId(discussionId,round,userId,statementId) returns statementId
    getStatementIds(discussionId,round,userId) returns an array of statementIds or undefined if there's a problem
    putGroupings(discussionId,round,userId,statementIds) nothing returned
    rankMostImportant(discussionId,round,userId,statementId) returns nothing
    getUserRecord(discussionId,userId) returns [round: Number]{shownStatementIds: [statementIds], groupings: [[statementIds],...]} or undefined


    report,
 */

/**
 * Systemic observations
 *
 * 1) If the best (lowest) statement gets put into a group, and that group doesn't win the rankings in that round, then it dissapears. Observed when proxy users randomly choosse the top of a group.
 *
 *
 * Messsy Edge Conditions to consider
 *
 * 1) A user is shwon a group of items, but then dissapears and never groups/ranks them
 *
 */

const Discussions = {} // [discussionId]{ShownStatements, ShownGroups, Gitems, Uitems}
//const ShownStatements = [] // [round: Number][{discussionId: ObjectId, round: Number, statementId: ObjectId, shownCount: Number, rank: Number}, ...]
//const ShownGroups = [] // [round: Number][{ statementIds: [ObjectId], shownCount: Number},...]
//const Gitems = [] // [round: Number]{discussionId: ObjectId, round: number, lowerStatementId: ObjectId, upperStatementId: ObjectId, shownCount: Number, groupedCound: Number}
//const Uitems = {} // [userId: ObjectId][round: Number][{shownStatementIds: {[statementId]: {rank: number, author: boolean}}, groupings: [[statementIds],...]}...]
//const Gitems = [] // [round: Number]{byLowerId: [{lowerStatementId: gitem }], byUpper: [{upperStatmentId: gitem}]}
//const gitem={discussionId: ObjectId, round: number, lowerStatementId: ObjectId, upperStatementId: ObjectId, shownCount: Number, groupedCound: Number}
/**const uInfo={
        [userId]: {
            [discussionId]: {
                [round]: {
                    shownStatementIds: {
                        [statementId]: { rank: 0, author: boolean },
                    },
                    groupings: []
                },
            },
        },
*/
async function initDiscussion(discussionId, options = {}) {
    Discussions[discussionId] = {
        ShownStatements: [],
        ShownGroups: [],
        Gitems: [],
        Uitems: {},
        group_size: options.group_size || GROUP_SIZE,
        gmajority: options.gmajority || GMAJORITY,
        max_rounds: options.max_rounds || MAX_ROUNDS,
        min_shown_count: options.min_shown_count || MIN_SHOWN_COUNT,
        min_rank: options.min_rank || MIN_RANK,
        updateUInfo: options.updateUInfo || (() => {}),
        getAllUInfo: options.getAllUInfo || (async () => []),
    }
    await reconstructDiscussionFromUInfo(discussionId)
}
module.exports.initDiscussion = initDiscussion

function initUitems(discussionId, userId, round = 0) {
    if (!Discussions[discussionId].Uitems[userId]) Discussions[discussionId].Uitems[userId] = []
    if (!Discussions[discussionId].Uitems[userId][round])
        Discussions[discussionId].Uitems[userId][round] = { userId, round, shownStatementIds: {}, groupings: [] }
}

// usually statements are only inserted at round 0, but this is made generic
function insertStatementId(discussionId, round, userId, statementId) {
    // this is where we would insert the statment into the DB

    const shownItem = {
        discussionId,
        round,
        statementId,
        shownCount: 0,
        rank: 0,
    }
    if (!Discussions[discussionId]) {
        throw new Error('Discussion:', discussionId, 'not initialized')
    }
    if (!Discussions[discussionId].ShownStatements[round]) Discussions[discussionId].ShownStatements[round] = []
    Discussions[discussionId].ShownStatements[round].push(shownItem)
    initUitems(discussionId, userId, round)

    Discussions[discussionId].Uitems[userId][round].shownStatementIds[statementId] = { rank: 0, author: true }
    Discussions[discussionId].updateUInfo({
        [userId]: {
            [discussionId]: {
                [round]: {
                    shownStatementIds: {
                        [statementId]: { rank: 0, author: true },
                    },
                },
            },
        },
    })
    return statementId
}

module.exports.insertStatementId = insertStatementId

/* on shownCount:
    when we give statements to people to look at, we need to track it so that they are not given to too many people
    but it doesn't really count as shown until the user submits their groupings.  Because it could be that the user gets them but never goes forwards, in which case we want to show them again.
    So, when we getStatements, we move the item to the next shown count bin, but we don't update the shown count until we get the response from the user.

    ???TBD - at some point we need to detect that a statement was given to a user, but we never received a response and handle it appropriately.
    ???How to put things into shownStatements or round 1 
    

*/

function getRandomUniqueList(max, count) {
    if (max < count) {
        console.error('getRandomCount impossible', max, 'less than', count)
        count = max
    }
    const list = []
    if (count === max) {
        // create a scrambled list of indexes
        const indexList = [...Array(count).keys()]
        while (indexList.length > 1) {
            let index = Math.floor(Math.random() * indexList.length)
            list.push(indexList[index])
            indexList.splice(index, 1)
        }
        list.push(indexList.shift())
    } else {
        const indexList = []
        while (list.length < count) {
            let index = Math.floor(Math.random() * max)
            while (indexList[index]) index = Math.floor(Math.random() * max)
            indexList[index] = true
            list.push(index)
        }
    }
    return list
}

function sortShownItemsByRank(aItem, bItem) {
    return bItem.rank - aItem.rank
}
function sortLargestFirst(a, b) {
    return b - a
}

async function getStatementIds(discussionId, round, userId) {
    if (!Discussions[discussionId]) {
        throw new Error('Discussion:', discussionId, 'not initialized')
    }
    if (!Discussions[discussionId]?.ShownStatements?.length) {
        return undefined
    }
    if (Discussions[discussionId].ShownStatements?.[0].length < Discussions[discussionId].group_size * 2 - 1)
        return undefined
    const dis = Discussions[discussionId]
    const statementIds = []
    if (!dis.ShownGroups[round]) dis.ShownGroups[round] = []
    if (dis.ShownGroups[round].at(-1)?.shownCount < dis.group_size) {
        for (const sId of dis.ShownGroups[round].at(-1).statementIds) statementIds.push(sId)
        dis.ShownGroups[round].at(-1).shownCount++
    } else if (round === 0) {
        // find all the statments that need to be seen, and randomly pick GROUP_SIZE-1 -- because the user will add one of their own
        const needToBeSeen = dis.ShownStatements[round].filter(sItem => sItem.shownCount < dis.group_size) //??? Should this GROUP_SIZE increase in situations where there are lots of similar ideas that get grouped - but not in round 0
        const shownGroup = { statementIds: [], shownCount: 1 }
        if (needToBeSeen.length === 0) console.error('need to be seen got 0')
        if (needToBeSeen.length < dis.group_size - 1) {
            console.info('needToBeSeen', needToBeSeen.length, 'is less than  ', dis.group_size)
            for (const sItem of needToBeSeen) {
                statementIds.push(sItem.statementId)
                shownGroup.statementIds.push(sItem.statementId)
            }
        } else {
            getRandomUniqueList(needToBeSeen.length, dis.group_size - 1).forEach(index => {
                statementIds.push(needToBeSeen[index].statementId)
                shownGroup.statementIds.push(needToBeSeen[index].statementId)
            })
        }
        dis.ShownGroups[round].push(shownGroup)
    } else {
        if (!dis.ShownStatements[round]) {
            // first time for this round, need to setup
            // make sure there are enough ranked items in the previous round to start
            if (dis.ShownStatements[round - 1].length < dis.group_size * 2) return
            const cutoff = Math.ceil(dis.ShownStatements[round - 1].length / dis.group_size)
            console.info('cutoff round', round, cutoff)
            let minRank = dis.ShownStatements[round - 1][cutoff].rank
            if (minRank < dis.min_rank) minRank = dis.min_rank
            console.info('starting round', round, 'minRank is', minRank)
            let highestRankedItems = []
            for (sItem of dis.ShownStatements[round - 1]) {
                if (sItem.rank < minRank) break // no need to go further
                highestRankedItems.push({
                    discussionId: sItem.discussionId,
                    round,
                    statementId: sItem.statementId,
                    shownCount: 0,
                    rank: 0,
                })
            }
            dis.ShownStatements[round] = highestRankedItems
            console.info(
                'Items that made it to round',
                round,
                ':',
                highestRankedItems.length,
                'of',
                dis.ShownStatements[round - 1].length
            )
        }
        if (dis.ShownStatements[round].length < dis.group_size) return
        const shownGroup = { statementIds: [], shownCount: 1 }
        const needToBeSeen = dis.ShownStatements[round].filter(sItem => sItem.shownCount < dis.group_size) //??? Should TEN increase in situations where there are lots of similar ideas that get grouped - but not in round 0
        let needToBeRemoved = []
        let shownItemsToRemove = []
        needToBeSeen.forEach(sItem => {
            const childIds = [sItem.statementId] // parent statement has to be in there, to keep it from getting added again
            gatherChildIds(discussionId, round - 1, sItem.statementId, childIds)
            childIds.shift() // discard the first one because of above
            childIds.forEach(id => {
                const nIndex = needToBeSeen.findIndex(sItem => sItem === id)
                if (nIndex >= 0) {
                    needToBeRemoved.push(nIndex)
                    const index = dis.ShownStatements[round].findIndex(sItem => sItem.statementId === id)
                    if (index >= 0) shownItemsToRemove.push(index)
                }
            })
        })
        needToBeRemoved.sort(sortLargestFirst)
        needToBeRemoved.forEach(index => needToBeSeen.splice(index, 1))
        shownItemsToRemove.sort(sortLargestFirst)
        if (shownItemsToRemove.length)
            console.info('shownItems to be removed - count', shownItemsToRemove.length, 'round', round)
        shownItemsToRemove.forEach(index => dis.ShownStatements[round].splice(index, 1))
        if (needToBeSeen.length < dis.group_size) return
        getRandomUniqueList(needToBeSeen.length, dis.group_size).forEach(index => {
            statementIds.push(needToBeSeen[index].statementId)
            shownGroup.statementIds.push(needToBeSeen[index].statementId)
        })
        dis.ShownGroups[round].push(shownGroup)
    }
    initUitems(discussionId, userId, round)
    const delta = { [userId]: { [discussionId]: { [round]: { shownStatementIds: {} } } } }
    for (sId of statementIds) {
        dis.Uitems[userId][round].shownStatementIds[sId] = { rank: 0 }
        delta[userId][discussionId][round].shownStatementIds[sId] = { rank: 0 }
    }

    dis.updateUInfo(delta)

    return statementIds
}

module.exports.getStatementIds = getStatementIds

function getUserRecord(discussionId, userId) {
    return Discussions[discussionId].Uitems[userId]
}
module.exports.getUserRecord = getUserRecord

function gatherChildIds(discussionId, round, id, childIds = [], depth = 5) {
    const dis = Discussions[discussionId]
    if (depth < 0) return childIds
    const bottom = Math.max(0, round - dis.max_rounds)
    for (let r = round - 1; r > bottom; r--) {
        for (const gitem of dis.Gitems[r].byLowerId?.[id] || []) {
            if (gitem.shownCount > dis.min_shown_count && gitem.groupedCount > gitem.shownCount * dis.gmajority) {
                if (childIds.includes(gitem.upperStatementId)) continue
                childIds.push(gitem.upperStatementId)
                gatherChildIds(discussionId, round, gitem.upperStatementId, childIds)
            }
        }
        for (const gitem of dis.Gitems[r].byUpperId?.[id] || []) {
            if (gitem.shownCount > dis.min_shown_count && gitem.groupedCount > gitem.shownCount * dis.gmajority) {
                if (childIds.includes(gitem.lowerStatementId)) continue
                childIds.push(gitem.lowerStatementId)
                gatherChildIds(discussionId, round, gitem.lowerStatementId, childIds)
            }
        }
    }
    return childIds // this is to return it to the parent caller of this recursive function
}

function incrementShownItems(discussionId, round, statementId) {
    const sitem = Discussions[discussionId].ShownStatements[round].find(i => statementId === i.statementId)
    if (!sitem) {
        console.error("incrementShownItems couldn't find", statementId, 'for round', round)
        return
    }
    sitem.shownCount++
}

// in the case of most/least ranking rank is +1 or -1.  With most/least ranking, it's possible that a statement gets enough early most votes
// to move up to the next round, but subsiquently gets least votes that would disqualify it from the round.
// if it has been shown in the next round, then it needs to remain - but if it has not be shown it should be removed.
function deltaShownItemsRank(discussionId, round, statementId, delta) {
    const dis = Discussions[discussionId]
    const sitem = dis.ShownStatements[round].find(i => statementId === i.statementId)
    if (!sitem) {
        console.error("incrementShownItemsRank couldn't find", statementId, 'for round', round)
        return
    }
    sitem.rank += delta
    dis.ShownStatements[round].sort(sortShownItemsByRank)
    if (dis.ShownStatements[round + 1]) {
        // a round has started above this one, had this ranked high enough to move into the next round
        const cutoff = Math.ceil(dis.ShownStatements[round].length / dis.group_size)
        const minRank =
            dis.ShownStatements[round][cutoff].rank > dis.min_rank
                ? dis.ShownStatements[round][cutoff].rank
                : dis.min_rank
        if (delta > 0) {
            if (sitem.rank >= minRank) {
                if (!dis.ShownStatements[round + 1].some(s => s.statementId === sitem.statementId)) {
                    /* this statment is not already in that list */
                    // list is sorted by rank, so put this at the end
                    dis.ShownStatements[round + 1].push({
                        discussionId: discussionId,
                        round: round + 1,
                        statementId: sitem.statementId,
                        shownCount: 0,
                        rank: 0,
                    })
                }
            }
        } else {
            if (sitem.rank < minRank) {
                const index = dis.ShownStatements[round + 1].findIndex(s => s.statementId === sitem.statementId)
                if (index >= 0 && dis.ShownStatements[round + 1][index].shownCount === 0)
                    dis.ShownStatements[round + 1].splice(index, 1)
            }
        }
    }
}

const sortLowestIdFirst = (a, b) => (a < b ? -1 : a > b ? 1 : 0)

// for the list of statementIds, call a func() iterate the pairs, assuming that order doesn't matter, and putting the lowest valued id first
// the function will be passed a gitem to work on. if the gitem did not exist it will be created.
function iteratePairs(discussionId, round, statementIds, func) {
    if (!statementIds || statementIds.length == 0) return
    const sortedStatementIds = statementIds.slice().sort(sortLowestIdFirst)
    let last = sortedStatementIds.length - 1
    if (!Discussions[discussionId].Gitems[round])
        Discussions[discussionId].Gitems[round] = { byLowerId: {}, byUpperId: {} }
    const g = Discussions[discussionId].Gitems[round] // shorten to speed it up
    for (let i = 0; i <= last - 1; i++) {
        const lowerStatementId = sortedStatementIds[i]
        for (let j = i + 1; j <= last; j++) {
            const upperStatementId = sortedStatementIds[j]
            let gitem = g.byLowerId[lowerStatementId]?.find(gitem => gitem.upperStatementId == upperStatementId)
            if (!gitem) {
                gitem = {
                    discussionId,
                    round,
                    lowerStatementId,
                    upperStatementId,
                    shownCount: 0,
                    groupedCount: 0,
                }
                // Yes we are pushing the same object into to different lists - this is a speed optimization
                if (!g.byLowerId[lowerStatementId]) g.byLowerId[lowerStatementId] = []
                g.byLowerId[lowerStatementId].push(gitem)
                if (!g.byUpperId[upperStatementId]) g.byUpperId[upperStatementId] = []
                g.byUpperId[upperStatementId].push(gitem)
            }
            func(gitem)
        }
    }
}

function putGroupings(discussionId, round, userId, groupings) {
    const uitem = Discussions[discussionId].Uitems[userId][round]
    //?? if there is already a groupins, should we uncount the groupins in gitems before overriding it - in the real world groupins may get resubmitted
    if (uitem?.groupings?.length) console.error('putGroupings already there', round, userId, groupings, uitem)
    uitem.groupings = groupings
    const shownStatementIds = Object.keys(uitem.shownStatementIds)
    for (id of shownStatementIds) incrementShownItems(discussionId, round, id)
    iteratePairs(discussionId, round, shownStatementIds, gitem => gitem.shownCount++)
    groupings.forEach(group => iteratePairs(discussionId, round, group, gitem => gitem.groupedCount++))
    Discussions[discussionId].updateUInfo({
        [userId]: {
            [discussionId]: { [round]: { groupings } },
        },
    })
}
module.exports.putGroupings = putGroupings

function rankMostImportant(discussionId, round, userId, statementId, rank = 1) {
    /* this is where we will write it to the database
    Rankings.push({statementId,round,ranking: 'most', userId, parentId: discussionId})
    */
    deltaShownItemsRank(discussionId, round, statementId, rank)
    Discussions[discussionId].Uitems[userId][round].shownStatementIds[statementId].rank = rank
    Discussions[discussionId].updateUInfo({
        [userId]: { [discussionId]: { [round]: { shownStatementIds: { [statementId]: { rank } } } } },
    })
}
module.exports.rankMostImportant = rankMostImportant

function findDeep(discussionId, sItem, id) {
    if (sItem.statmentId === id) return true
    const childIds =
        gatherChildIds(discussionId, Discussions[discussionId].ShownStatements.length - 1, sItem.statementId) || []
    if (childIds.some(child => child._id === id)) return true
    else return false
}

function report(discussionId, Statements) {
    //console.info(JSON.stringify({ShownItems},null,2))
    console.info('the highest ranked is', Statements[Discussions[discussionId].ShownStatements.at(-1)[0].statementId])
    const lowest = Object.values(Statements).reduce(
        (min, s, i) => (Number(s.description) < Number(min.description) ? { ...s, index: i } : min),
        { description: Infinity }
    )
    console.info('the loweset statement is', lowest)
    console.info(
        'the children are',
        gatherChildIds(
            discussionId,
            Discussions[discussionId].ShownStatements.length - 1,
            Discussions[discussionId].ShownStatements.at(-1)[0].statementId
        ).map(id => Statements[id].description)
    )
    console.info('the number in the last round is', Discussions[discussionId].ShownStatements.at(-1).length)
    console.info(
        'rounds',
        Discussions[discussionId].ShownStatements.map(dround => dround.length)
    )
    //console.info("the last shown",Statements[ShownItems[discussionId].at(-1)[0].statementId],Statements[ShownItems[discussionId].at(-1)?.[1]?.statementId])
    console.info(
        'the last round:',
        Discussions[discussionId].ShownStatements.at(-1).map(sItem => Statements[sItem.statementId])
    )
    if (Discussions[discussionId].ShownStatements.at(-1).some(sItem => sItem.statementId === lowest._id))
        console.info('the lowest is in the final round')
    else {
        if (Discussions[discussionId].ShownStatements.at(-1).some(sItem => findDeep(discussionId, sItem, lowest._id)))
            console.info('the lowest is in a child of the final round')
        else {
            console.error('the lowest is not in the final round')
            for (const round in Discussions[discussionId].ShownStatements) {
                const shownItem = Discussions[discussionId].ShownStatements[round].find(
                    sItem => sItem.statementId === lowest._id
                )
                if (!shownItem) console.info("it wansn't found in round", round)
                else {
                    console.info('round:', round, shownItem)
                    const gitems = (Discussions[discussionId].Gitems[round].byLowerId[shownItem.statementId] || [])
                        .filter(gitem => gitem.upperStatementId === shownItem.statementId)
                        .concat(
                            (Discussions[discussionId].Gitems[round].byUpperId[shownItem.statementId] || []).filter(
                                gitem => gitem.lowerStatementId === shownItem.statementId
                            )
                        )
                    console.info('groupings:', gitems)
                }
            }
        }
    }
    console.info(
        'Gitems',
        Discussions[discussionId].Gitems.map(a => [Object.keys(a.byLowerId).length, Object.keys(a.byUpperId).length])
    )
}
module.exports.report = report

function sortShownGroupItemsByLowestLast(a, b) {
    return b.shownCount - a.shownCount
}
async function reconstructDiscussionFromUInfo(discussionId) {
    console.info('readDiscussionInFromDb')
    const docs = await Discussions[discussionId].getAllUInfo(discussionId)
    if (!docs?.length) return
    // first insert all the statements from their authors.
    // we have to do this pass first so that the Uinfo element will be created for the authors
    let rounds_length = 1
    let round = 0
    // users can only insert statement at round 0
    while (round < rounds_length) {
        console.info('round', round, rounds_length)
        const shownGroups = {} // object for quick existence test, to array later
        const shownStatements = {} // object for quick existence test, to array later
        for (const uinfo of docs) {
            const userId = Object.keys(uinfo)[0]
            if (round === 0) rounds_length = Math.max(rounds_length, Object.keys(uinfo[userId][discussionId]).length)
            const uitem = uinfo[userId][discussionId][round]
            if (!uitem) continue
            const shownStatementIds = Object.keys(uitem.shownStatementIds)
            // shownGroups are identified by the first id in the list, that is not authored by the user
            const shownGroupIds = shownStatementIds.filter(id => !uitem.shownStatementIds[id].author)
            if (!shownGroups[shownGroupIds[0]])
                shownGroups[shownGroupIds[0]] = { statementIds: shownGroupIds, shownCount: 1 }
            else {
                shownGroups[shownGroupIds[0]].shownCount += 1
                if (process.env.NODE_ENV !== 'production')
                    deepEqual(shownGroups[shownGroupIds[0]].statementIds, shownGroupIds)
            }
            for (const id of shownStatementIds) {
                if (!shownStatements[id])
                    shownStatements[id] = {
                        discussionId,
                        round,
                        statementId: id,
                        shownCount: 0,
                        rank: 0,
                    }
                shownStatements[id].shownCount += 1
                if (uitem.shownStatementIds[id].author) shownStatements[id].author = true
                if (uitem.shownStatementIds[id].rank) shownStatements[id].rank += uitem.shownStatementIds[id].rank
            }
            const groupings = uitem.groupings
            iteratePairs(discussionId, round, shownStatementIds, gitem => gitem.shownCount++)
            groupings.forEach(group => iteratePairs(discussionId, round, group, gitem => gitem.groupedCount++))
            if (!Discussions[discussionId].Uitems[userId]) Discussions[discussionId].Uitems[userId] = []
            Discussions[discussionId].Uitems[userId][round] = { userId, ...uitem }
        }
        Discussions[discussionId].ShownStatements[round] = Object.values(shownStatements).sort(sortShownItemsByRank)
        Discussions[discussionId].ShownGroups[round] = Object.values(shownGroups).sort(sortShownGroupItemsByLowestLast)
        round++
    }
    await getStatementIds(discussionId, round, 0)
}
