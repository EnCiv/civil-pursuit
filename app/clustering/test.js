// clustering test
const merge = require('lodash').merge
const showDeepDiff = require('show-deep-diff')

const ObjectID = require('bson-objectid')
const {
    insertStatementId,
    getStatementIds,
    putGroupings,
    report,
    rankMostImportant,
    getUserRecord,
    initDiscussion,
    Discussions,
} = require('./clustering')
const MAX_ANSWER = 100
const DISCUSSION_ID = 1
const NUMBER_OF_PARTICIPANTS = 240 // the number of simulated people in the discussion
//const NUMBER_OF_PARTICIPANTS = 17000
//const NUMBER_OF_PARTICIPANTS = 17000 * 7

function sortLowestDescriptionFirst(a, b) {
    return Number(a.description) - Number(b.description)
}
const Statements = {} // [statementId: ObjectId]{_id: ObjectId, discussionId: ObjectId, round: Number, subject: String, description: String, userId: ObjectId}

const UserInfo = {}
function updateUInfo(obj) {
    merge(UserInfo, obj)
}

// proxy user does this for grouping
// because we are sorting to begine with, the values in the groups will be sorted too
function groupStatementsWithTheSameFloor(statements) {
    const ungrouped = []
    const groups = []
    const sortedStatements = statements.slice().sort(sortLowestDescriptionFirst)
    let lastGroup = 0
    for (let s = 0; s < sortedStatements.length; s++) {
        if (!groups[lastGroup] && s < sortedStatements.length - 1) {
            if (Math.floor(sortedStatements[s].description) === Math.floor(sortedStatements[s + 1].description)) {
                groups[lastGroup] = [sortedStatements[s], sortedStatements[s + 1]]
                s++
            } else ungrouped.push(sortedStatements[s])
        } else if (
            groups[lastGroup] &&
            Math.floor(groups[lastGroup].at(-1).description) === Math.floor(sortedStatements[s].description)
        ) {
            groups[lastGroup].push(sortedStatements[s])
        } else {
            if (groups[lastGroup]) {
                ++lastGroup
            }
            ungrouped.push(sortedStatements[s])
        }
    }
    groups.forEach(group => {
        // randomize the top item of the group
        const topIndex = Math.floor(Math.random() * group.length)
        const top = group[topIndex]
        group.splice(topIndex, 1)
        group.unshift(top)
    })
    return [groups, ungrouped]
}

const UserIds = []

async function proxyUser() {
    const userId = ObjectID().toString()
    UserIds.push(userId)
    const statement = { subject: 'proxy random number', description: Math.random() * MAX_ANSWER + 1, userId }
    let round = 0
    while (1) {
        const statementIdsForGrouping = (await getStatementIds(DISCUSSION_ID, round, userId)) || []
        const statementsForGrouping = statementIdsForGrouping.map(id => Statements[id])
        if (round === 0) {
            const _id = ObjectID().toString()
            statementsForGrouping.push(insertStatementId(DISCUSSION_ID, round, userId, _id)) // insert the statement after getting the statement list to avoid getting it back
            Statements[_id] = { _id, DISCUSSION_ID, ...statement }
        }
        if (statementsForGrouping.length <= 1) return
        const [groupings, ungrouped] = groupStatementsWithTheSameFloor(statementsForGrouping)
        putGroupings(
            DISCUSSION_ID,
            round,
            userId,
            groupings.map(group => group.map(statement => statement._id))
        )
        const forRanking = groupings.map(group => group[0]).concat(ungrouped)
        const rankMostId = forRanking.sort(sortLowestDescriptionFirst)[0]._id
        rankMostImportant(DISCUSSION_ID, round, userId, rankMostId)
        round++
    }
}
async function main() {
    await initDiscussion(DISCUSSION_ID, { updateUInfo: updateUInfo })
    for (let i = 0; i < NUMBER_OF_PARTICIPANTS; i++) {
        process.stdout.write('new user ' + i + '\r')
        await proxyUser()
    }
    let i = 0
    let ids
    for (const userId of UserIds) {
        process.stdout.write('returning user ' + i++ + '\r')
        let userRecord = getUserRecord(DISCUSSION_ID, userId) || []
        let round = userRecord.length - 1
        let statementsForGrouping = []
        if (round < 0) {
            // no user record
            console.info("user didn't exist", userId)
            round = 0
            const statementIdsForGrouping = (await getStatementIds(DISCUSSION_ID, round, userId)) || []
            statementsForGrouping = statementIdsForGrouping.map(id => Statements[id])
        } else if ((ids = Object.keys(userRecord[round].shownStatementIds)) <= 1) {
            // the user didn't get a full set of statements so they didn't finish that round
            const statementIdsForGrouping = (await getStatementIds(DISCUSSION_ID, round, userId)) || []
            if (!statementIdsForGrouping.some(id => id === ids[0]))
                console.error(
                    "user is coming back again but didn't get the one they got before",
                    userId,
                    sIds,
                    statementIdsForGrouping
                )
            statementsForGrouping = statementIdsForGrouping.map(id => Statements[id])
        } else {
            round++
            const statementIdsForGrouping = (await getStatementIds(DISCUSSION_ID, round, userId)) || []
            statementsForGrouping = statementIdsForGrouping.map(id => Statements[id])
        }
        while (statementsForGrouping.length) {
            const [groupings, ungrouped] = groupStatementsWithTheSameFloor(statementsForGrouping)
            putGroupings(
                DISCUSSION_ID,
                round,
                userId,
                groupings.map(group => group.map(statement => statement._id))
            )
            const rankMostId = statementsForGrouping.sort(sortLowestDescriptionFirst)[0]._id
            rankMostImportant(DISCUSSION_ID, round, userId, rankMostId)
            round++
            const statementIdsForGrouping = (await getStatementIds(DISCUSSION_ID, round, userId)) || []
            statementsForGrouping = statementIdsForGrouping.map(id => Statements[id])
        }
    }
    report(DISCUSSION_ID, Statements)
    console.info('Initialising discussion 2')
    await initDiscussion(2, {
        getAllUInfo: async () => {
            const Uinfos = Object.keys(UserInfo).map(uId => {
                const rounds = UserInfo[uId][1]
                return { [uId]: { 2: rounds } }
            })
            return Uinfos
        },
    })
    console.info('reporting on discussion 2')
    report(2, Statements)
    console.info('show differences between 1 and 2')
    for (const round of Discussions[1].ShownStatements) round.sort(sortShownStatementsByRankThenId)
    for (const round of Discussions[2].ShownStatements) round.sort(sortShownStatementsByRankThenId)
    for (const round of Discussions[1].ShownGroups) round.sort(sortShownGroupsByCountThenId)
    for (const round of Discussions[2].ShownGroups) round.sort(sortShownGroupsByCountThenId)
    showDeepDiff(Discussions[1], Discussions[2])
}

function sortShownStatementsByRankThenId(a, b) {
    if (b.rank - a.rank !== 0) return b.rank - a.rank
    if (b.statementId > a.statementId) return -1
    if (b.statementId < a.statementId) return 1
    return 0
}

function sortShownGroupsByCountThenId(a, b) {
    if (b.shownCount !== a.shownCount) return b.shownCount - a.shownCount
    if (b.statementIds[0] > a.statementIds[0]) return -1
    if (b.statementIds[0] < a.statementIds[0]) return 1
    return 0
}

main()
