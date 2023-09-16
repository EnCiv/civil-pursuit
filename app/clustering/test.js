// clustering test
const ObjectID=require('bson-objectid')
const {insertStatement, getStatements, putGroupings, report, rankMostImportant, Uitems, Statements} = require('./clustering')
const MAX_ANSWER=100
const DISCUSSION_ID=1
const NUMBER_OF_PARTICIPANTS=2400 //17000 //2400 // the number of simulated people in the discussion

function sortLowestDescriptionFirst(a,b){
    return Number(a.description)-Number(b.description)
}

// proxy user does this for grouping
// because we are sorting to begine with, the values in the groups will be sorted too
function groupStatementsWithTheSameFloor(statements){
    const ungrouped=[]
    const groups=[]
    const sortedStatements=statements.slice().sort(sortLowestDescriptionFirst)
    let lastGroup=0
    for(let s=0; s<sortedStatements.length;s++){
        if(!groups[lastGroup] && s<sortedStatements.length-1){
            if(Math.floor(sortedStatements[s].description)===Math.floor(sortedStatements[s+1].description)){
                groups[lastGroup]=[sortedStatements[s],sortedStatements[s+1]]
                s++
            } else ungrouped.push(sortedStatements[s])
        } else if(groups[lastGroup] && Math.floor(groups[lastGroup].at(-1).description)===Math.floor(sortedStatements[s].description)){
            groups[lastGroup].push(sortedStatements[s])
        } else {
            if(groups[lastGroup]){
                ++lastGroup
            }
            ungrouped.push(sortedStatements[s])
        }
    }
    groups.forEach(group=>{
        // randomize the top item of the group
        const topIndex=Math.floor(Math.random()*group.length)
        const top=group[topIndex]
        group.splice(topIndex,1)
        group.unshift(top)
    })
    return [groups, ungrouped]
}

function proxyUser(){
    const userId=ObjectID().toString()
    const statement={subject: 'proxy random number', description: (Math.random()*MAX_ANSWER)+1, userId}
    let round=0
    while(1){
        const statementsForGrouping=getStatements(round,userId) || []
        if(round===0) statementsForGrouping.push(insertStatement(round, userId, statement)) // insert the statement after getting the statement list to avoid getting it back
        if(statementsForGrouping.length<=1) return
        const [groupings, ungrouped] = groupStatementsWithTheSameFloor(statementsForGrouping)
        putGroupings(round,userId,groupings.map(group=>group.map(statement=>statement._id)))
        const forRanking=groupings.map(group=>group[0]).concat(ungrouped)
        const rankMostId=forRanking.sort(sortLowestDescriptionFirst)[0]._id
        rankMostImportant(userId, round, rankMostId)
        round++
        //break
    }
}

for(let i=0;i<NUMBER_OF_PARTICIPANTS;i++) {
    process.stdout.write("new user "+i+"\r")
    proxyUser()
}
let i=0
for(const userId in Uitems){
    process.stdout.write("returning user "+ ( i++)+"\r")
    let round=Uitems[userId].length-1
    let statementsForGrouping=[]
    if(!Uitems[userId][round].groupings?.length){
        statementsForGrouping=Uitems[userId][round].shownStatementIds.map(id=>Statements[id])
    }else {
        round++
        statementsForGrouping=getStatements(round,userId) || []
    }
    while(statementsForGrouping.length){
        const [groupings, ungrouped] = groupStatementsWithTheSameFloor(statementsForGrouping)
        putGroupings(round,userId,groupings.map(group=>group.map(statement=>statement._id)))
        const rankMostId=statementsForGrouping.sort(sortLowestDescriptionFirst)[0]._id
        rankMostImportant(userId, round, rankMostId)
        round++
        statementsForGrouping=getStatements(round,userId) || []
    }
}
report()
