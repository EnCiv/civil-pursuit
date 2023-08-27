// clustering test
const ObjectID=require('bson-objectid')
const MAX_ANSWER=100
const DISCUSSION_ID=1
const TEN=10 // this is the group size
const GMAJORITY=0.50 //Group Majority - minimum percentage of group that votes for it to be part of the group
const MAX_ROUNDS=2 // maximum number of rounds to search down when clustering children

const Statements={}
const StatementsA=[]

const Sitems={}


const ShownItems={
    DISCUSSION_ID: []
}

const Uitems=[]

function insertStatement(statement){
    const _id=ObjectID().toString()
    Statements[_id]={_id, discussion_id: DISCUSSION_ID, ...statement}
    StatementsA.push(_id)
    const ShownItem={
        _id: ObjectID().toString(), 
        discussion_id: DISCUSSION_ID,
        round: 0,
        statementId: _id,
        shownCount: 0,
        rank: 0
    }
    ShownItems[DISCUSSION_ID][ShownItem.round]=[]
    ShownItems[DISCUSSION_ID][ShownItem.round][ShownItem.shownCount]=[ShownItem]
}


/* on shownCount:
    when we give statements to people to look at, we need to track it so that they are not given to too many people
    but it doesn't really count as shown until the user submits their groupings.  Because it could be that the user gets them but never goes forwards, in which case we want to show them again.
    So, when we getStatements, we move the item to the next shown count bin, but we don't update the shown count until we get the response from the user.

    TBD - at some point we need to detect that a statment was given to a user, but we never received a response and handle it appropriately.

*/
function getStatements(round,userId){
    if(StatementsA.length<(TEN-1)) return undefined
    const statements=[]
    let shownIndex=0
    const needed=TEN-1 // in a group of TEN, you need TEN-1 statments
    while(statements.length<(needed-1)){
        if(ShownItems[DISCUSSION_ID][round][shownIndex].length<((needed-1)-statements.length)) {
            while(ShownItems[DISCUSSION_ID][round][shownIndex].length>0) {
                const sItem=ShownItems[DISCUSSION_ID][round][shownIndex].shift()
                ShownItems[DISCUSSION_ID][round][shownIndex+1].push(sItem)
                statements.push(Statements[sItem.statementId])
            }
        }else{
            while(statements.length<(needed-1)){
                const index=Math.floor(Math.round()*ShownItems[DISCUSSION_ID][round][shownIndex].length)
                const sItem=ShownItems[DISCUSSION_ID][round][shownIndex][index]
                ShownItems[DISCUSSION_ID][round][shownIndex].splice(index,1)
                ShownItems[DISCUSSION_ID][round][shownIndex+1].push(sItem)
                statements.push(Statements[sItem.statementId])
            }
        }
        shownIndex++
    }
    Uitems.push({
        discussionId: DISCUSSION_ID,
        userId,
        round,
        shownStatementIds: statements.map(s=>s._id),
        groupings: []
    })
    if(round>0){
        // we need to add in the groupings
        for(const statement of statements){
            const children=[statement._id];
            statement.children=gatherChildren(round,statement._id,children) // statementId has to be in there, to keep it from getting added again
            children.pop() // discard the first one because of above
            if(children.length) statement.children=children
            //??? should children be id's or objects and should the name indicate what
        }
    }
    return statements
}

function gatherChildren(round,id,children=[],depth=5){
    if(depth<0) return children
    const bottom=Math.max(0,r-MAX_ROUNDS)
    for(const r=round-1; r>bottom; r--){
        for(const gitem of Gitems[r]){
            let otherItem=null
            if(gitem.groupedCount>gitem.shownCount*GMAJORITY){
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
    let shownIndex=0
    while(ShownItems[DISCUSSION_ID][round][shownIndex]){ // if we get undefined we're done
        const sitem=ShownItems[DISCUSSION_ID][round][shownIndex].find(i=>statementId===i.statementId)
        if(sitem) {
            sitem.shownCount++
            return
        } else
            shownIndex++
    }
    console.error("incrementShownItems couldn't find",statementId, "for round", round)
}

function incrementShownItemsRank(round,statementId){
    let shownIndex=0
    while(ShownItems[DISCUSSION_ID][round][shownIndex]){ // if we get undefined we're done
        const sitem=ShownItems[DISCUSSION_ID][round][shownIndex].find(i=>statementId===i.statementId)
        if(sitem) {
            sitem.rank++
            return
        } else
            shownIndex++
    }
    console.error("incrementShownItemsRank couldn't find",statementId, "for round", round)
}

const Gitems=[[]]
function incrementGitemShown(round, statements){
    if(!statements||statements.length==0) return
    let last=statements.length-1
    for(let i=0;i<last-1;i++){
        const lowerStatementId=gstatements[i]
        for(let j=i+1;j<last;j++){
            const upperStatementId=gstatements[j]
            if(!Gitems[round]) Gitems[round]=[]
            let gitem=Gitems[round].find(gitem=>gitem.lowerStatementId===lowerStatementId&&gitem.upperStatementId==upperStatementId)
            if(!gitem){
                gitem={
                    discussionId: DISCUSSION_ID,
                    round,
                    lowerStatementId,
                    upperStatementId,
                    shownCount: 1, // this user just saw it
                    groupedCount: 0,
                }
                Gitems[round].push(gitem)
            } else {
                gitem.shownCount++
            }
        }
    }
}

function iteratePairs(round,statements,func){
    if(!statements||statements.length==0) return
    let last=statements.length-1
    for(let i=0;i<last-1;i++){
        const lowerStatementId=statements[i]
        for(let j=i+1;j<last;j++){
            const upperStatmentId=statements[j]
            if(!Gitems[lowerStatementId+upperStatmentId+round]){
                Gitems[lowerStatementId+upperStatmentId+round]={
                    discussionId: DISCUSSION_ID,
                    round,
                    lowerStatementId,
                    upperStatementId,
                    shownCount: 0, 
                }
                func(Gitems[lowerStatementId+upperStatmentId+round])
            } else {
                func(Gitems[lowerStatementId+upperStatmentId+round])
            }
        }
    }
}

function putGroupings(round,userId,groupings){
    const uitem=Uitems.find(i=>i.round===round&&i.userId===userId)
    //?? if there is already a groupins, should we uncount the groupins in gitems before overriding it - in the real world groupins may get resubmitted
    uitem.groupings=groupings
    uitem.shownStatementIds.forEach(s=>incrementShownItems(round, s))
    iteratePairs(round,uitem.shownStatementIds, gitem=>gitem.shownCount++)
    groupings.forEach(group=>iteratePairs(round,group,gitem=>gitem.groupedCount++))
}

function sortNumericLowestFirst(a,b){
    (a,b)=>Number(a.description)-Number(b.description)
}

// proxy user does this for grouping
// because we are sorting to begine with, the values in the groups will be sorted too
function groupStatementsWithTheSameFloor(statements){
    const ungrouped=[]
    const groups=[[]]
    const sortedStatements=statements.toSorted(sortNumericLowestFirst)
    let lastGroup=0
    for(let s=0; s<sortedStatements.length-2;s++){
        if(groups[lastGroup].length===0){
            if(Math.floor(sortedStatements[s].description)===Math.floor(sortedStatements[s+1].description)){
                groups[++lastGroup]=[sortedStatements[s],sortedStatements[s+1]]
                s++
            } else ungrouped.push(sortedStatements[s])
        } else if(Math.floor(sortedStatements[s].description)===Math.floor(sortedStatements[s+1].description)){
            groups[lastGroup].push(sortedStatements[s+1])
        } else {
            ++lastGroup
            groups.push([])
            ungrouped.push(sortedStatements[s])
        }
    }
    if(groups[lastGroup].length===0) groups.pop() // don't have an empty one at the end
    return [groups, ungrouped]
}

const Rankings=[]

function rankMostImportant(userId,round,statementId){
    Rankings.push({statementId,round,ranking: 'most', userId, parentId: DISCUSSION_ID})
    incrementShownItemsRank(round,statementId)
}

function proxyUser(){
    const userId=ObjecID().toString()
    const statement={subject: 'proxy random number', description: Math.random()*MAX_ANSWER, userId}
    let round=0
    while(1){
        const statementsForGrouping=getStatements(round,userId)
        if(round===0) insertStatement(statement) // insert the statement after getting the statement list to avoid getting it back
        if(!statementsForGrouping) return
        statementsForGrouping.push(statement) // add the original statement to the list
        const [groupings, ungrouped] = groupStatementsWithTheSameFloor(statementsForGrouping)
        putGroupings(round,userId,groupings.map(group.map(statement=>statement._id)))
        const merged=groupings.concat(ungrouped).sort((a,b)=>Number(a.description || a[0].description)- Nummber(b.description || b[0].description))
        const rankMostId=merged[0]._id||merged[0][0]._id
        rankMostImportant(userId, round, rankMostId)
        round++
    }
}
