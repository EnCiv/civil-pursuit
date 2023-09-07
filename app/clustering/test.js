// clustering test
const ObjectID=require('bson-objectid')
const MAX_ANSWER=100
const DISCUSSION_ID=1
const TEN=9 // this is the group size
const GMAJORITY=0.50 //Group Majority - minimum percentage of group that votes for it to be part of the group
const MAX_ROUNDS=2 // maximum number of rounds to search down when clustering children
const MIN_SHOWN_COUNT= Math.floor(TEN/2)+1 // the minimum number of times a item pair is shown in order to decide if a majority have grouped it

const Statements={}
const StatementsA=[]

const ShownItems={
    [DISCUSSION_ID]: []
}

const Uitems={}

function insertStatement(round, userId, statement){
    const _id=ObjectID().toString()
    Statements[_id]={_id, discussionId: DISCUSSION_ID, ...statement}
    StatementsA.push(_id)
    const ShownItem={
        _id: ObjectID().toString(), 
        discussionId: DISCUSSION_ID,
        round: 0,
        statementId: _id,
        shownCount: 0,
        rank: 0
    }
    if(!ShownItems[DISCUSSION_ID][ShownItem.round])
        ShownItems[DISCUSSION_ID][ShownItem.round]=[]
    ShownItems[DISCUSSION_ID][ShownItem.round].push(ShownItem)
    Uitems[userId] && Uitems[userId][round].shownStatementIds.push(_id)
    return Statements[_id]
}


/* on shownCount:
    when we give statements to people to look at, we need to track it so that they are not given to too many people
    but it doesn't really count as shown until the user submits their groupings.  Because it could be that the user gets them but never goes forwards, in which case we want to show them again.
    So, when we getStatements, we move the item to the next shown count bin, but we don't update the shown count until we get the response from the user.

    ???TBD - at some point we need to detect that a statement was given to a user, but we never received a response and handle it appropriately.
    ???How to put things into shownStatements or round 1 
    

*/

function getRandomUniqueList(max,count){
    if(max<count) {
        console.error("getRandomCount impossible",max,"less than", count)
        count=max
    }
    const list=[]
    while(list.length<count){
        let index=Math.floor(Math.random()*max)
        while(list.includes(index))
            index=Math.floor(Math.random()*max)
        list.push(index)
    }
    return list
}

function sortShownItemsByRank(aItem,bItem){
    return bItem.rank-aItem.rank
}

const ShownGroups=[]
//{ statementIds, shownCount}

function getStatements(round,userId){
    if(StatementsA.length<(TEN-1)) return undefined
    const statements=[]
    if(ShownGroups[round] && ShownGroups[round].at(-1).shownCount<TEN){
        for(const sId of ShownGroups[round].at(-1).statementIds)
            statements.push(Statements[sId])
        ShownGroups[round].at(-1).shownCount++
    }else if(round===0) {
        // find all the statments that need to be seen, and randomly pick TEN-1 -- because the user will add one of their own
        const needToBeSeen=ShownItems[DISCUSSION_ID][round].filter(sItem=>sItem.shownCount<TEN) //??? Should TEN increase in situations where there are lots of similar ideas that get grouped - but not in round 0
        const shownGroup={statementIds:[],shownCount: 1}
        if(needToBeSeen.length===0) console.error('need to be seen got 0')
        if(needToBeSeen.length<(TEN-1)){
            console.info("needToBeSeen",needToBeSeen.length,"is less than  ", TEN)
            for(const sItem of needToBeSeen){
                statements.push(Statements[sItem.statementId])
                shownGroup.statementIds.push(sItem.statementId)
            }
        }else {
            getRandomUniqueList(needToBeSeen.length,TEN-1).forEach(
                index=>{
                    statements.push(Statements[needToBeSeen[index].statementId]); 
                    shownGroup.statementIds.push(needToBeSeen[index].statementId)
                })
        }
        if(!ShownGroups[round]) ShownGroups[round]=[]
        ShownGroups[round].push(shownGroup)
    } else {
        if(!ShownItems[DISCUSSION_ID][round]){ // first time for this round, need to setup
            // make sure there are enough ranked items in the previous round to start
            if(ShownItems[DISCUSSION_ID][round-1].length<10) return
            const cutoff=Math.ceil(ShownItems[DISCUSSION_ID][round-1].length/TEN)
            console.info("cutoff round",round,cutoff)
            let minRank=ShownItems[DISCUSSION_ID][round-1][cutoff].rank
            if(minRank<1)minRank=1
            console.info("starting round",round,"minRank is",minRank)
            let highestRankedItems=[]
            for(sItem of ShownItems[DISCUSSION_ID][round-1]){
                if(sItem.rank < minRank) break // no need to go further
                highestRankedItems.push({
                    _id: ObjectID().toString(),
                    discussionId: sItem.discussionId,
                    round,
                    statementId: sItem.statementId,
                    shownCount: 0,
                    rank: 0
                })
            }
            ShownItems[DISCUSSION_ID][round]=highestRankedItems
            console.info("Items that made it to round",round,":",highestRankedItems.length, "of",ShownItems[DISCUSSION_ID][round-1].length)
        }
        const shownGroup={statementIds:[], shownCount: 1}
        const needToBeSeen=ShownItems[DISCUSSION_ID][round].filter(sItem=>sItem.shownCount<TEN ) //??? Should TEN increase in situations where there are lots of similar ideas that get grouped - but not in round 0
        if(needToBeSeen.length<TEN) return
        getRandomUniqueList(needToBeSeen.length,TEN).forEach(                
            index=>{
                statements.push(Statements[needToBeSeen[index].statementId]); 
                shownGroup.statementIds.push(needToBeSeen[index].statementId)
        })
        if(!ShownGroups[round]) ShownGroups[round]=[]
        ShownGroups[round].push(shownGroup)
    }
    if(!Uitems[userId]) Uitems[userId]=[]
    Uitems[userId][round]={
        discussionId: DISCUSSION_ID,
        userId,
        round,
        shownStatementIds: statements.map(s=>s._id),
        groupings: []
    }
    if(round>0){
        // we need to add in the groupings
        for(const statement of statements){
            const children=[statement._id];// parent statement has to be in there, to keep it from getting added again
            statement.children=gatherChildren(round-1,statement._id,children) 
            children.shift() // discard the first one because of above
            if(children.length) { 
                statement.children=children
                children.forEach(id=>{
                    const index=ShownItems[DISCUSSION_ID][round].findIndex(sItem=>sItem.statementId===id)
                    if(index>=0) ShownItems[DISCUSSION_ID][round].splice(index,1)
                    const sIndex=statements.findIndex(s=>s._id===id)
                    if(sIndex) console.error("found a child in statements", statement, statements[sIndex])
                })
            }
            //??? should children be id's or objects and should the name indicate what
        }
    }
    return statements
}

function gatherChildren(round,id,children=[],depth=5){
    if(depth<0) return children
    const bottom=Math.max(0,round-MAX_ROUNDS)
    for(let r=round-1; r>bottom; r--){
        for(const gitem of Gitems[r]){
            let otherItem=null
            if(gitem.shownCount > MIN_SHOWN_COUNT && gitem.groupedCount>gitem.shownCount*GMAJORITY){
                if(gitem.lowerStatementId===id) otherItem=gitem.upperStatementId
                else if(gitem.upperStatementId===id) otherItem=gitem.lowerStatementId
                else continue;
                if(children.includes(otherItem)) continue
                children.push(otherItem)
                gatherChildren(round,otherItem,children)
            }
        }
    }
    return children // this is to return it to the parent caller of this recursive function
}

function incrementShownItems(round,statementId){
    const sitem=ShownItems[DISCUSSION_ID][round].find(i=>statementId===i.statementId)
    if(!sitem) { 
        console.error("incrementShownItems couldn't find",statementId, "for round", round)
        return
    }
    sitem.shownCount++
}

function incrementShownItemsRank(round,statementId){
    const sitem=ShownItems[DISCUSSION_ID][round].find(i=>statementId===i.statementId)
    if(!sitem) { 
        console.error("incrementShownItemsRank couldn't find",statementId, "for round", round)
        return
    }
    sitem.rank++
    ShownItems[DISCUSSION_ID][round].sort(sortShownItemsByRank)
    if(ShownItems[DISCUSSION_ID][round+1]){ // a round has started round above this on, had this ranked high enough to move into the next round
        const cutoff=Math.ceil(ShownItems[DISCUSSION_ID][round].length/TEN)
        const minRank=ShownItems[DISCUSSION_ID][round][cutoff].rank || 1
        if(sitem.rank>=minRank){
            if(!ShownItems[DISCUSSION_ID][round+1].some(s=>s.statementId===sitem.statementId)){ /* this statment is not already in that list */
                // list is sorted by rank, so put this at the end
                ShownItems[DISCUSSION_ID][round+1].push({
                    _id: ObjectID().toString(),
                    discussionId: DISCUSSION_ID,
                    round: round+1,
                    statementId: sitem.statementId,
                    shownCount: 0,
                    rank: 0
                })
            }
        }
    }
}

const Gitems=[]

const sortLowestIdFirst=(a,b)=>a<b?-1:a>b?1:0

function iteratePairs(round,statementIds,func){
    if(!statementIds||statementIds.length==0) return
    const sortedStatementIds=statementIds.slice().sort(sortLowestIdFirst)
    let last=sortedStatementIds.length-1
    if(!Gitems[round]) Gitems[round]=[]
    for(let i=0;i<=last-1;i++){
        const lowerStatementId=sortedStatementIds[i]
        for(let j=i+1;j<=last;j++){
            const upperStatementId=sortedStatementIds[j]
            let gitem=Gitems[round].find(gitem=>gitem.lowerStatementId===lowerStatementId&&gitem.upperStatementId==upperStatementId)
            if(!gitem){
                gitem={
                    discussionId: DISCUSSION_ID,
                    round,
                    lowerStatementId,
                    upperStatementId,
                    shownCount: 0, 
                    groupedCount: 0
                }
                Gitems[round].push(gitem)
            }
            func(gitem)
        }
    }
}

function putGroupings(round,userId,groupings){
    const uitem=Uitems[userId][round]
    //?? if there is already a groupins, should we uncount the groupins in gitems before overriding it - in the real world groupins may get resubmitted
    if(uitem?.groupings?.length) console.error("putGroupings already there",round,userId,groupings,uitem)
    uitem.groupings=groupings
    uitem.shownStatementIds.forEach(s=>incrementShownItems(round, s))
    iteratePairs(round,uitem.shownStatementIds, gitem=>gitem.shownCount++)
    groupings.forEach(group=>iteratePairs(round,group,gitem=>gitem.groupedCount++))
}

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
    return [groups, ungrouped]
}

const Rankings=[]

function rankMostImportant(userId,round,statementId){
    Rankings.push({statementId,round,ranking: 'most', userId, parentId: DISCUSSION_ID})
    incrementShownItemsRank(round,statementId)
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
        const rankMostId=statementsForGrouping.sort(sortLowestDescriptionFirst)[0]._id
        rankMostImportant(userId, round, rankMostId)
        round++
    }
}

for(let i=0;i<22222;i++) proxyUser()
for(const userId in Uitems){
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
//console.info(JSON.stringify({ShownItems},null,2))
console.info("the highest ranked is", Statements[ShownItems[DISCUSSION_ID].at(-1)[0].statementId])
const lowest=Object.values(Statements).reduce((min,s,i)=>Number(s.description)< Number(min.description) ? {...s, index: i} : min,{description: MAX_ANSWER+1})
console.info("the loweset statement is", lowest)
console.info("the children are", gatherChildren(ShownItems[DISCUSSION_ID].length-1,ShownItems[DISCUSSION_ID].at(-1)[0].statementId).map(id=>Statements[id].description))
console.info("the number in the last round is",ShownItems[DISCUSSION_ID].at(-1).length)
console.info("rounds",ShownItems[DISCUSSION_ID].map(dround=>dround.length))
console.info("the last shown",Statements[ShownItems[DISCUSSION_ID].at(-1)[0].statementId],Statements[ShownItems[DISCUSSION_ID].at(-1)?.[1]?.statementId])
if(ShownItems[DISCUSSION_ID].at(-1).some(sItem=>sItem.statementId===lowest._id)) console.info("the lowest is in the final round"); else console.error("the lowest is not in the last round")
console.info("Gitems",Gitems.map(a=>a.length))