// clustering test
const ObjectID=require('bson-objectid')
const DISCUSSION_ID=1
const GROUP_SIZE=7 // this is the group size
const GMAJORITY=0.50 //Group Majority - minimum percentage of group that votes for it to be part of the group
const MAX_ROUNDS=10 // maximum number of rounds to search down when clustering children
const MIN_SHOWN_COUNT= Math.floor(GROUP_SIZE/2)+1 // the minimum number of times a item pair is shown in order to decide if a majority have grouped it
const MIN_RANK=2 // when filterning statements for the next round, they must at least have this number of users voting for it

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

const Statements={}
const StatementsA=[]
module.exports.Statements=Statements

const ShownItems={
    [DISCUSSION_ID]: []
}

const Uitems={}
module.exports.Uitems=Uitems

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

module.exports.insertStatement=insertStatement

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
function sortLargestFirst(a,b){
    return b-a
}

const ShownGroups=[]
//{ statementIds, shownCount}

function getStatements(round,userId){
    if(StatementsA.length<(GROUP_SIZE*2-1)) return undefined
    const statements=[]
    if(ShownGroups[round] && ShownGroups[round].at(-1).shownCount<GROUP_SIZE){
        for(const sId of ShownGroups[round].at(-1).statementIds)
            statements.push(Statements[sId])
        ShownGroups[round].at(-1).shownCount++
    }else if(round===0) {
        // find all the statments that need to be seen, and randomly pick GROUP_SIZE-1 -- because the user will add one of their own
        const needToBeSeen=ShownItems[DISCUSSION_ID][round].filter(sItem=>sItem.shownCount<GROUP_SIZE) //??? Should this GROUP_SIZE increase in situations where there are lots of similar ideas that get grouped - but not in round 0
        const shownGroup={statementIds:[],shownCount: 1}
        if(needToBeSeen.length===0) console.error('need to be seen got 0')
        if(needToBeSeen.length<(GROUP_SIZE-1)){
            console.info("needToBeSeen",needToBeSeen.length,"is less than  ", GROUP_SIZE)
            for(const sItem of needToBeSeen){
                statements.push(Statements[sItem.statementId])
                shownGroup.statementIds.push(sItem.statementId)
            }
        }else {
            getRandomUniqueList(needToBeSeen.length,GROUP_SIZE-1).forEach(
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
            if(ShownItems[DISCUSSION_ID][round-1].length<GROUP_SIZE*2) return
            const cutoff=Math.ceil(ShownItems[DISCUSSION_ID][round-1].length/GROUP_SIZE)
            console.info("cutoff round",round,cutoff)
            let minRank=ShownItems[DISCUSSION_ID][round-1][cutoff].rank
            if(minRank<MIN_RANK)minRank=MIN_RANK
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
        if(ShownItems[DISCUSSION_ID][round].length<GROUP_SIZE) return
        const shownGroup={statementIds:[], shownCount: 1}
        const needToBeSeen=ShownItems[DISCUSSION_ID][round].filter(sItem=>sItem.shownCount<GROUP_SIZE ) //??? Should TEN increase in situations where there are lots of similar ideas that get grouped - but not in round 0
        let needToBeRemoved=[]
        let shownItemsToRemove=[]
        needToBeSeen.forEach(sItem=>{
            const childIds=[sItem.statementId] // parent statement has to be in there, to keep it from getting added again
            gatherChildIds(round-1,sItem.statementId,childIds)
            childIds.shift() // discard the first one because of above
            if(childIds.length){
                Statements[sItem.statementId].children=childIds // okay to overwrite previous list of children
                childIds.forEach(id=>{
                    const nIndex=needToBeSeen.findIndex(sItem=>sItem===id)
                    if(nIndex>=0) {
                        needToBeRemoved.push(nIndex)
                        const index=ShownItems[DISCUSSION_ID][round].findIndex(sItem=>sItem.statementId===id)
                        if(index>=0) shownItemsToRemove.push(index)
                    }
                })
            }
        })
        needToBeRemoved.sort(sortLargestFirst)
        needToBeRemoved.forEach(index=>needToBeSeen.splice(index,1))
        shownItemsToRemove.sort(sortLargestFirst)
        if(shownItemsToRemove.length) console.info("shownItems to be removed - count",shownItemsToRemove.length, "round",round)
        shownItemsToRemove.forEach(index=>ShownItems[DISCUSSION_ID][round].splice(index,1))
        if(needToBeSeen.length<GROUP_SIZE) return
        getRandomUniqueList(needToBeSeen.length,GROUP_SIZE).forEach(                
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
    return statements
}

module.exports.getStatements=getStatements

function gatherChildIds(round,id,childIds=[],depth=5){
    if(depth<0) return childIds
    const bottom=Math.max(0,round-MAX_ROUNDS)
    for(let r=round-1; r>bottom; r--){
        for(const gitem of Gitems[r]){
            let otherStatementId=''
            if(gitem.shownCount > MIN_SHOWN_COUNT && gitem.groupedCount>gitem.shownCount*GMAJORITY){
                if(gitem.lowerStatementId===id) otherStatementId=gitem.upperStatementId
                else if(gitem.upperStatementId===id) otherStatementId=gitem.lowerStatementId
                else continue;
                if(childIds.includes(otherStatementId)) continue
                childIds.push(otherStatementId)
                gatherChildIds(round,otherStatementId,childIds)
            }
        }
    }
    return childIds // this is to return it to the parent caller of this recursive function
}

module.exports.gatherChildIds=gatherChildIds

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
    if(ShownItems[DISCUSSION_ID][round+1]){ // a round has started above this one, had this ranked high enough to move into the next round
        const cutoff=Math.ceil(ShownItems[DISCUSSION_ID][round].length/GROUP_SIZE)
        const minRank=ShownItems[DISCUSSION_ID][round][cutoff].rank > MIN_RANK ? ShownItems[DISCUSSION_ID][round][cutoff].rank :  MIN_RANK
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
module.exports.putGroupings=putGroupings

const Rankings=[]

function rankMostImportant(userId,round,statementId){
    Rankings.push({statementId,round,ranking: 'most', userId, parentId: DISCUSSION_ID})
    incrementShownItemsRank(round,statementId)
}
module.exports.rankMostImportant=rankMostImportant

function findDeep(sItem,id){
    if(sItem.statmentId===id) return true
    const childIds=gatherChildIds(ShownItems[DISCUSSION_ID].length-1,sItem.statementId) || []
    if(childIds.some(child=>child._id===id)) return true
    else return false
}

function report(){
    //console.info(JSON.stringify({ShownItems},null,2))
    console.info("the highest ranked is", Statements[ShownItems[DISCUSSION_ID].at(-1)[0].statementId])
    const lowest=Object.values(Statements).reduce((min,s,i)=>Number(s.description)< Number(min.description) ? {...s, index: i} : min,{description: Infinity})
    console.info("the loweset statement is", lowest)
    console.info("the children are", gatherChildIds(ShownItems[DISCUSSION_ID].length-1,ShownItems[DISCUSSION_ID].at(-1)[0].statementId).map(id=>Statements[id].description))
    console.info("the number in the last round is",ShownItems[DISCUSSION_ID].at(-1).length)
    console.info("rounds",ShownItems[DISCUSSION_ID].map(dround=>dround.length))
    //console.info("the last shown",Statements[ShownItems[DISCUSSION_ID].at(-1)[0].statementId],Statements[ShownItems[DISCUSSION_ID].at(-1)?.[1]?.statementId])
    console.info("the last round:",ShownItems[DISCUSSION_ID].at(-1).map(sItem=>Statements[sItem.statementId]))
    if(ShownItems[DISCUSSION_ID].at(-1).some(sItem=>sItem.statementId===lowest._id)) console.info("the lowest is in the final round"); else {
        if(ShownItems[DISCUSSION_ID].at(-1).some(sItem=>findDeep(sItem,lowest._id))) console.info("the lowest is in a child of the final round")
        else {
            console.error("the lowest is not in the final round")
            for(const round in ShownItems[DISCUSSION_ID]){
                const shownItem=ShownItems[DISCUSSION_ID][round].find(sItem=>sItem.statementId===lowest._id)
                if(!shownItem) console.info("it wansn't found in round",round)
                else {
                    console.info("round:",round, shownItem)
                    const gitems=Gitems[round].filter(gitem=>gitem.lowerStatementId===shownItem.statementId || gitem.upperStatementId===shownItem.statementId)
                    console.info("groupings:", gitems)
                }
            }
        }
    }
    console.info("Gitems",Gitems.map(a=>a.length))
}
module.exports.report=report