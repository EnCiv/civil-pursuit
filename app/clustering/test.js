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
const NUMBER_OF_PARTICIPANTS = 16807 // 4096 //240 // the number of simulated people in the discussion
// const NUMBER_OF_PARTICIPANTS = 17000
//const NUMBER_OF_PARTICIPANTS = 17000 * 7

function sortLowestDescriptionFirst(a, b) {
    return Number(a.description) - Number(b.description)
}
const Statements = {} // [statementId: ObjectId]{_id: ObjectId, discussionId: ObjectId, round: Number, subject: String, description: String, userId: ObjectId}

const UserInfo = {}
function updateUInfo(obj) {
    merge(UserInfo, obj)
    const userId = Object.keys(obj)[0]
    const discussionId = Object.keys(obj[userId])[0]
    const round = +Object.keys(obj[userId][discussionId])[0] // make it a number
    if (UserInfo[userId][discussionId][round]?.shownStatementIds) {
        const ids = Object.keys(UserInfo[userId][discussionId][round].shownStatementIds)
        if (round === 0 && ids.length === 1) return
        if (ids.length === Discussions[discussionId].group_size) return
        console.error('updateUInfo size mismatch', obj)
        debugger
    }
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
    let round = 0
    const statement = {
        _id: ObjectID().toString(),
        subject: 'proxy random number',
        description: Math.random() * MAX_ANSWER + 1,
        userId,
    }
    Statements[statement._id] = statement
    insertStatementId(DISCUSSION_ID, round, userId, statement._id)
    while (1) {
        const statementIdsForGrouping = await getStatementIds(DISCUSSION_ID, round, userId)
        if (!statementIdsForGrouping) return
        const statementsForGrouping = statementIdsForGrouping.map(id => Statements[id])
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

async function proxyUserReturn(userId, final = 0) {
    let ids
    let userRecord = getUserRecord(DISCUSSION_ID, userId) || []
    let round = userRecord.length - 1

    let statementsForGrouping = []
    if (round < 0) {
        // no user record
        console.info("user didn't exist", userId)
        round = 0
        const statementIdsForGrouping = (await getStatementIds(DISCUSSION_ID, round, userId)) || []
        statementsForGrouping = statementIdsForGrouping.map(id => Statements[id])
    } else if ((ids = Object.keys(userRecord[round].shownStatementIds)).length <= 1) {
        // the user didn't get a full set of statements so they didn't finish that round
        const statementIdsForGrouping = (await getStatementIds(DISCUSSION_ID, round, userId)) || []
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
        const forRanking = groupings.map(group => group[0]).concat(ungrouped)
        const rankMostId = forRanking.sort(sortLowestDescriptionFirst)[0]._id
        rankMostImportant(DISCUSSION_ID, round, userId, rankMostId)
        round++
        const statementIdsForGrouping = (await getStatementIds(DISCUSSION_ID, round, userId)) || []
        statementsForGrouping = statementIdsForGrouping.map(id => Statements[id])
    }
}

async function main() {
    await initDiscussion(DISCUSSION_ID, { updateUInfo: updateUInfo })
    for (let i = 0; i < NUMBER_OF_PARTICIPANTS; i++) {
        process.stdout.write('new user ' + i + '\r')
        await proxyUser()
        checkUInfo(DISCUSSION_ID)
    }
    process.stdout.write('\n')
    let i = 0
    for (const userId of UserIds) {
        process.stdout.write('returning user ' + i++ + '\r')
        await proxyUserReturn(userId)
        checkUInfo(DISCUSSION_ID)
    }
    if (Discussions[DISCUSSION_ID].ShownStatements.at(-1).length > Discussions[DISCUSSION_ID].group_size) {
        console.info(
            'before last round',
            Discussions[DISCUSSION_ID].ShownStatements.length - 1,
            'has',
            Discussions[DISCUSSION_ID].ShownStatements.at(-1).length
        )
        // need one last round
        i = 0
        const final = Discussions[DISCUSSION_ID].ShownStatements.length - 1
        process.stdout.write(`\nLastRound: ${final}\n`)
        for (const userId of UserIds) {
            process.stdout.write('returning user ' + i++ + '\r')
            await proxyUserReturn(userId, final)
        }
    }
    console.info(
        'after last round',
        Discussions[DISCUSSION_ID].ShownStatements.length - 1,
        'has',
        Discussions[DISCUSSION_ID].ShownStatements.at(-1).length
    )
    process.stdout.write('\n')
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
    for (const dId of [1, 2]) {
        for (const round of Discussions[dId].ShownStatements)
            round.sort(sortShownStatementsByHighestRankThenLowestShownCountThenLowestId)
        for (const round of Discussions[dId].ShownGroups) round.sort(sortShownGroupsByCountThenId)
        for (const round of Discussions[dId].Gitems) {
            const byLowerId = {}
            const byUpperId = {}
            Object.entries(round.byLowerId).forEach(
                ([key, value]) => (byLowerId[key] = value.sort(sortGitemsUpperStatementId))
            )
            Object.entries(round.byUpperId).forEach(
                ([key, value]) => (byUpperId[key] = value.sort(sortGitemsLowerStatementId))
            )
            round.byLowerId = byLowerId
            round.byUpperId = byUpperId
        }
    }
    showDeepDiff(Discussions[1], Discussions[2])
}

function checkUInfo(discussionId) {
    for (const uInfo of Object.values(UserInfo)) {
        for (const round of Object.values(uInfo[discussionId])) {
            const keys = Object.keys(round.shownStatementIds)
            if (keys.length !== 1 && keys.length !== Discussions[discussionId].group_size)
                console.error('keys was', keys.length)
        }
    }
}

function sortShownStatementsByHighestRankThenLowestShownCountThenLowestId(a, b) {
    if (b.rank - a.rank !== 0) return b.rank - a.rank
    if (a.shownCount !== b.shownCount) return a.shownCount - b.shownCount
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

function sortGitemsUpperStatementId(a, b) {
    if (b.upperStatementId > a.upperStatementId) return -1
    if (b.upperStatementId < a.upperStatementId) return 1
    return 0
}

function sortGitemsLowerStatementId(a, b) {
    if (b.lowerStatementId > a.lowerStatementId) return -1
    if (b.lowerStatementId < a.lowerStatementId) return 1
    return 0
}
main()
