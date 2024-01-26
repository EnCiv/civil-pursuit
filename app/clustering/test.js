// clustering test
const merge = require('lodash').merge

const ObjectID = require('bson-objectid')
const {
    insertStatementId,
    getStatementIds,
    putGroupings,
    report,
    rankMostImportant,
    getUserRecord,
    initDiscussion,
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
    initDiscussion(DISCUSSION_ID, { updateUInfo: updateUInfo })
    for (let i = 0; i < NUMBER_OF_PARTICIPANTS; i++) {
        process.stdout.write('new user ' + i + '\r')
        await proxyUser()
    }
    let i = 0
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
        } else if (!userRecord[round].groupings?.length) {
            statementsForGrouping = Object.keys(userRecord[round].shownStatementIds).map(id => Statements[id])
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
}

main()
