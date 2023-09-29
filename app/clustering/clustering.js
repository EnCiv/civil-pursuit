// clustering
const ObjectID = require('bson-objectid')
const GROUP_SIZE = 7 // this is the group size
const GMAJORITY = 0.5 //Group Majority - minimum percentage of group that votes for it to be part of the group
const MAX_ROUNDS = 10 // maximum number of rounds to search down when clustering children
const MIN_SHOWN_COUNT = Math.floor(GROUP_SIZE / 2) + 1 // the minimum number of times a item pair is shown in order to decide if a majority have grouped it
const MIN_RANK = 2 // when filterning statements for the next round, they must at least have this number of users voting for it

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
const Statements = {} // [statementId: ObjectId]{_id: ObjectId, discussionId: ObjectId, round: Number, subject: String, description: String, userId: ObjectId}
//const ShownStatements = [] // [round: Number][{_id: ObjectId, discussionId: ObjectId, round: Number, statementId: ObjectId, shownCount: Number, rank: Number}, ...]
//const ShownGroups = [] // [round: Number][{ statementIds: [ObjectId], shownCount: Number},...]
//const Gitems = [] // [round: Number]{discussionId: ObjectId, round: number, lowerStatementId: ObjectId, upperStatementId: ObjectId, shownCount: Number, groupedCound: Number}
//const Uitems = {} // [userId: ObjectId][round: Number][{shownStatementIds: [statementIds], groupings: [[statementIds],...]}...]

module.exports.Statements = Statements

function initDiscussion(discussionId) {
    Discussions[discussionId] = { ShownStatements: [], ShownGroups: [], Gitems: [], Uitems: {} }
}

function initUitems(discussionId, userId, round = 0) {
    if (!Discussions[discussionId].Uitems[userId]) Discussions[discussionId].Uitems[userId] = []
    if (!Discussions[discussionId].Uitems[userId][round])
        Discussions[discussionId].Uitems[userId][round] = { userId, round, shownStatementIds: [], groupings: [] }
}

// usually statements are only inserted at round 0, but this is made generic
function insertStatement(discussionId, round, userId, statement) {
    // this is where we would insert the statment into the DB
    const _id = ObjectID().toString()
    Statements[_id] = { _id, discussionId, ...statement }
    const shownItem = {
        _id: ObjectID().toString(),
        discussionId,
        round,
        statementId: _id,
        shownCount: 0,
        rank: 0,
    }
    if (!Discussions[discussionId]) {
        initDiscussion(discussionId)
        readDiscussionInFromDb(discussionId) // this adds data in the background no need to async wait here
    }
    if (!Discussions[discussionId].ShownStatements[round]) Discussions[discussionId].ShownStatements[round] = []
    Discussions[discussionId].ShownStatements[round].push(shownItem)
    initUitems(discussionId, userId, round)
    Discussions[discussionId].Uitems[userId][round].shownStatementIds.push(_id)
    return Statements[_id]
}

module.exports.insertStatement = insertStatement

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
    while (list.length < count) {
        let index = Math.floor(Math.random() * max)
        while (list.includes(index)) index = Math.floor(Math.random() * max)
        list.push(index)
    }
    return list
}

function sortShownItemsByRank(aItem, bItem) {
    return bItem.rank - aItem.rank
}
function sortLargestFirst(a, b) {
    return b - a
}

async function getStatements(discussionId, round, userId) {
    if (!Discussions[discussionId]) {
        await readDiscussionInFromDb(discussionId)
        if (!Discussions[discussionId]?.ShownStatements?.length) {
            return undefined
        }
    }
    if (Discussions[discussionId].ShownStatements?.[0].length < GROUP_SIZE * 2 - 1) return undefined
    const statements = []
    if (!Discussions[discussionId].ShownGroups[round]) Discussions[discussionId].ShownGroups[round] = []
    if (Discussions[discussionId].ShownGroups[round].at(-1)?.shownCount < GROUP_SIZE) {
        for (const sId of Discussions[discussionId].ShownGroups[round].at(-1).statementIds)
            statements.push(Statements[sId])
        Discussions[discussionId].ShownGroups[round].at(-1).shownCount++
    } else if (round === 0) {
        // find all the statments that need to be seen, and randomly pick GROUP_SIZE-1 -- because the user will add one of their own
        const needToBeSeen = Discussions[discussionId].ShownStatements[round].filter(
            sItem => sItem.shownCount < GROUP_SIZE
        ) //??? Should this GROUP_SIZE increase in situations where there are lots of similar ideas that get grouped - but not in round 0
        const shownGroup = { statementIds: [], shownCount: 1 }
        if (needToBeSeen.length === 0) console.error('need to be seen got 0')
        if (needToBeSeen.length < GROUP_SIZE - 1) {
            console.info('needToBeSeen', needToBeSeen.length, 'is less than  ', GROUP_SIZE)
            for (const sItem of needToBeSeen) {
                statements.push(Statements[sItem.statementId])
                shownGroup.statementIds.push(sItem.statementId)
            }
        } else {
            getRandomUniqueList(needToBeSeen.length, GROUP_SIZE - 1).forEach(index => {
                statements.push(Statements[needToBeSeen[index].statementId])
                shownGroup.statementIds.push(needToBeSeen[index].statementId)
            })
        }
        Discussions[discussionId].ShownGroups[round].push(shownGroup)
    } else {
        if (!Discussions[discussionId].ShownStatements[round]) {
            // first time for this round, need to setup
            // make sure there are enough ranked items in the previous round to start
            if (Discussions[discussionId].ShownStatements[round - 1].length < GROUP_SIZE * 2) return
            const cutoff = Math.ceil(Discussions[discussionId].ShownStatements[round - 1].length / GROUP_SIZE)
            console.info('cutoff round', round, cutoff)
            let minRank = Discussions[discussionId].ShownStatements[round - 1][cutoff].rank
            if (minRank < MIN_RANK) minRank = MIN_RANK
            console.info('starting round', round, 'minRank is', minRank)
            let highestRankedItems = []
            for (sItem of Discussions[discussionId].ShownStatements[round - 1]) {
                if (sItem.rank < minRank) break // no need to go further
                highestRankedItems.push({
                    _id: ObjectID().toString(),
                    discussionId: sItem.discussionId,
                    round,
                    statementId: sItem.statementId,
                    shownCount: 0,
                    rank: 0,
                })
            }
            Discussions[discussionId].ShownStatements[round] = highestRankedItems
            console.info(
                'Items that made it to round',
                round,
                ':',
                highestRankedItems.length,
                'of',
                Discussions[discussionId].ShownStatements[round - 1].length
            )
        }
        if (Discussions[discussionId].ShownStatements[round].length < GROUP_SIZE) return
        const shownGroup = { statementIds: [], shownCount: 1 }
        const needToBeSeen = Discussions[discussionId].ShownStatements[round].filter(
            sItem => sItem.shownCount < GROUP_SIZE
        ) //??? Should TEN increase in situations where there are lots of similar ideas that get grouped - but not in round 0
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
                    const index = Discussions[discussionId].ShownStatements[round].findIndex(
                        sItem => sItem.statementId === id
                    )
                    if (index >= 0) shownItemsToRemove.push(index)
                }
            })
        })
        needToBeRemoved.sort(sortLargestFirst)
        needToBeRemoved.forEach(index => needToBeSeen.splice(index, 1))
        shownItemsToRemove.sort(sortLargestFirst)
        if (shownItemsToRemove.length)
            console.info('shownItems to be removed - count', shownItemsToRemove.length, 'round', round)
        shownItemsToRemove.forEach(index => Discussions[discussionId].ShownStatements[round].splice(index, 1))
        if (needToBeSeen.length < GROUP_SIZE) return
        getRandomUniqueList(needToBeSeen.length, GROUP_SIZE).forEach(index => {
            statements.push(Statements[needToBeSeen[index].statementId])
            shownGroup.statementIds.push(needToBeSeen[index].statementId)
        })
        Discussions[discussionId].ShownGroups[round].push(shownGroup)
    }
    initUitems(discussionId, userId, round)
    Discussions[discussionId].Uitems[userId][round].shownStatementIds.push(...statements.map(s => s._id))
    return statements
}

module.exports.getStatements = getStatements

function getUserRecord(discussionId, userId) {
    return Discussions[discussionId].Uitems[userId]
}
module.exports.getUserRecord = getUserRecord

function gatherChildIds(discussionId, round, id, childIds = [], depth = 5) {
    if (depth < 0) return childIds
    const bottom = Math.max(0, round - MAX_ROUNDS)
    for (let r = round - 1; r > bottom; r--) {
        for (const gitem of Discussions[discussionId].Gitems[r]) {
            let otherStatementId = ''
            if (gitem.shownCount > MIN_SHOWN_COUNT && gitem.groupedCount > gitem.shownCount * GMAJORITY) {
                if (gitem.lowerStatementId === id) otherStatementId = gitem.upperStatementId
                else if (gitem.upperStatementId === id) otherStatementId = gitem.lowerStatementId
                else continue
                if (childIds.includes(otherStatementId)) continue
                childIds.push(otherStatementId)
                gatherChildIds(discussionId, round, otherStatementId, childIds)
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
    const sitem = Discussions[discussionId].ShownStatements[round].find(i => statementId === i.statementId)
    if (!sitem) {
        console.error("incrementShownItemsRank couldn't find", statementId, 'for round', round)
        return
    }
    sitem.rank += delta
    Discussions[discussionId].ShownStatements[round].sort(sortShownItemsByRank)
    if (Discussions[discussionId].ShownStatements[round + 1]) {
        // a round has started above this one, had this ranked high enough to move into the next round
        const cutoff = Math.ceil(Discussions[discussionId].ShownStatements[round].length / GROUP_SIZE)
        const minRank =
            Discussions[discussionId].ShownStatements[round][cutoff].rank > MIN_RANK
                ? Discussions[discussionId].ShownStatements[round][cutoff].rank
                : MIN_RANK
        if (delta > 0) {
            if (sitem.rank >= minRank) {
                if (
                    !Discussions[discussionId].ShownStatements[round + 1].some(s => s.statementId === sitem.statementId)
                ) {
                    /* this statment is not already in that list */
                    // list is sorted by rank, so put this at the end
                    Discussions[discussionId].ShownStatements[round + 1].push({
                        _id: ObjectID().toString(),
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
                const index = Discussions[discussionId].ShownStatements[round + 1].findIndex(
                    s => s.statementId === sitem.statementId
                )
                if (index >= 0 && Discussions[discussionId].ShownStatements[round + 1][index].shownCount === 0)
                    Discussions[discussionId].ShownStatements[round + 1].splice(index, 1)
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
    if (!Discussions[discussionId].Gitems[round]) Discussions[discussionId].Gitems[round] = []
    for (let i = 0; i <= last - 1; i++) {
        const lowerStatementId = sortedStatementIds[i]
        for (let j = i + 1; j <= last; j++) {
            const upperStatementId = sortedStatementIds[j]
            let gitem = Discussions[discussionId].Gitems[round].find(
                gitem => gitem.lowerStatementId === lowerStatementId && gitem.upperStatementId == upperStatementId
            )
            if (!gitem) {
                gitem = {
                    discussionId,
                    round,
                    lowerStatementId,
                    upperStatementId,
                    shownCount: 0,
                    groupedCount: 0,
                }
                Discussions[discussionId].Gitems[round].push(gitem)
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
    uitem.shownStatementIds.forEach(s => incrementShownItems(discussionId, round, s))
    iteratePairs(discussionId, round, uitem.shownStatementIds, gitem => gitem.shownCount++)
    groupings.forEach(group => iteratePairs(discussionId, round, group, gitem => gitem.groupedCount++))
}
module.exports.putGroupings = putGroupings

function rankMostImportant(discussionId, userId, round, statementId) {
    /* this is where we will write it to the database
    Rankings.push({statementId,round,ranking: 'most', userId, parentId: discussionId})
    */
    deltaShownItemsRank(discussionId, round, statementId, 1)
}
module.exports.rankMostImportant = rankMostImportant

function findDeep(discussionId, sItem, id) {
    if (sItem.statmentId === id) return true
    const childIds =
        gatherChildIds(discussionId, Discussions[discussionId].ShownStatements.length - 1, sItem.statementId) || []
    if (childIds.some(child => child._id === id)) return true
    else return false
}

function report(discussionId) {
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
                    const gitems = Discussions[discussionId].Gitems[round].filter(
                        gitem =>
                            gitem.lowerStatementId === shownItem.statementId ||
                            gitem.upperStatementId === shownItem.statementId
                    )
                    console.info('groupings:', gitems)
                }
            }
        }
    }
    console.info(
        'Gitems',
        Discussions[discussionId].Gitems.map(a => a.length)
    )
}
module.exports.report = report

async function readDiscussionInFromDb(discussioinId) {
    // for now just act like nothing was found
    if (!Discussions[discussioinId]) initDiscussion(discussioinId)
}
