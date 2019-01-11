'use strict';

import {ObjectID} from 'mongodb';
import DB from '../lib/util/db';

/** Happy Case
 * 
 * User casts a vote, and subscribes to the status of votes for this item.  When any user votes, or changes their vote, all interested users receive an updated vote tally.
 * 
 * Edge Conditions
 * 
 * 1) First time for any subscription
 * 2) First time for a subscription on this itemId
 * 3) User disconnects
 * 4) User unmounts the page that subscribed to this
 * 5) User changes his vote (latest vote counts)
 * 6) Server has restarted and there is historical data for this subscription
 * 7) New users subscribes and there is historical data for that user
 * 8) After the first user subscribes, but before historical data is obtained, another user subscribes
 * 9) While in the act of getting votes out of the DB, don't lose track of the count because of new votes coming in
 * 
 * Constraints:
 * 
 * 1) Don't over use the database
 * 2) Don't lose votes - every after a server restart
 * 3) Limit Server memory use be proportional to the number of active users
 * 
 * Out of Scope for now
 * 
 * 1) Scaling beyond what 1 server can support
 * 
 */

const nullVote=()=>({criteria: null, lastId: ObjectID.createFromTime(1)});
const COLL="pvote" // Collection Name
const EVENT="PvoteInfo" // socket event name

export default class PVote {

    static sendUpdate(item){ // send updates to socket subscribers
        if(item){
            let list=PVote.updateList
            if(!list)
                list=PVote.updateList={};
            list[item]=true;
            if(PVote.updateTimeout)
                return;
        }
        let items=Object.keys(PVote.updateList);
        PVote.updateList={};
        if(items.length){
            let itm;
            for(itm of items)
                io.sockets.in(itm).emit(EVENT,PVote.pvotes[itm]['totals']);
            PVote.updateTimeout=setTimeout(
                ()=>PVote.sendUpdate(),
                Math.log2(items.length)*1000
            )
        } else
            PVote.updateTimeout=0;
    }

    static post(pvote){ // post to database
        PVote.add(pvote);
        PVote.sendUpdate(pvote.item)
        DB.db.collection(COLL).insertOne(pvote)
        .then(result=>{
            if(result.insertedCount!==1)
                console.info("PVote.post result:",result.result)
        })
        .catch(err=>{
            logger.error("PVote.post error:", pvote, err)
        })
    }

    static getLastVote(itemId,userId){
        return new Promise((ok,ko)=>{
            DB.db.collection(COLL).aggregate([
                { $match: {item: itemId, user: userId}},
                { $sort: {_id: 1 } },
                { $group: { _id: {user: "$user", item: "$item"},
                            criteria: {$last: "$criteria"},
                            lastId: {$last: '$_id'}
                         }
                },
            ]).toArray((err,arr)=>{
                if(err){
                    logger.error("PVote.getLastVote error", itemId,userId,err);
                    return ok({})
                }
                var result=arr[0] ? {criteria: arr[0].criteria, lastId: arr[0].lastId} : nullVote();
                return ok(result);
            })
        })
    }

    static getTotals(itemId, userId){
        return new Promise((ok,ko)=>{
            DB.db.collection(COLL).aggregate([
                { $match: {item: itemId}},
                { $sort: { item: 1, user: 1, _id: 1}},
                { $group: { _id: {user: "$user", item: "$item"},
                            criteria: {$last: "$criteria"},
                            lastId: {$last: '$_id'}
                        }
                },
                { $addFields: {
                    _ownVote: {$in: ["$_id.user", [userId]]}
                }},
                { $sort: { "_id.item": 1, "_id.user": 1, lastId: 1}},
                { $group: { _id: {_ownVote: "$_ownVote", criteria: "$criteria"},
                        count: {$sum: 1},
                        lastId: {$last: '$lastId'}
                        }
                },
                { $project: {"_id": 0,
                        _ownVote: "$_id._ownVote",
                        criteria: "$_id.criteria",
                        count: "$count",
                        lastId: "$lastId"
                    }
                }
            ]).toArray((err,arr)=>{
                if(err){
                    console.error("PVote.getTotals error", err);
                    setTimeout(()=>ok({}),100); // if there is an error, wait some time and then end the promise with an empty result.
                    return;
                }
                var result={};
                for(let pv of arr){
                    if(pv._ownVote) {
                        result._ownVote={criteria: pv.criteria, lastId: pv.lastId}
                        if(result[pv.criteria]){
                            result.pv.criteria.count+=1;
                        }else{
                            result[pv.criteria]={count: 1}
                        }
                    } else {
                        if(result[pv.criteria])
                            result[pv.criteria]+=pv.count;
                        else
                            result[pv.criteria]={count: pv.count};
                    }
                }
                ok(result)
            })
        })
    }

    // set the totals for the item, based on the totals obtained from the DB and if a user's ownVote is included add the users votes
    static setTotals(itemId,totals){
        let it=PVote.pvotes;
        if(!it) return logger.error("PVote.setTotals pvotes does not exist");
        if(!it[itemId]) logger.error("PVote.setTotals itemId does not exist:",itemId);
        it=it[itemId];
        if(!it.totals){
            it.totals=totals;
            return;
        }
        it=it.totals;
        let c; for(c in totals){
            if(it[c]){
                if(it[c].count!==totals[c].count){
                    logger.error("PVote.setTotals difference detected",it,results)
                    it[c].count=totals[c].count
                } // else they are the same so do nothing
            }else{
                it[c]={count: totals[c].count}
            }
        }
    }

    // add a user's votes to the local structure - 
    static add(pvote) {
        let lastId=pvote._id;
        let itemId=pvote.item;
        let userId=pvote.user;
        let criteria=pvote.criteria;

        let it=PVote.pvotes;
        if(!it) return logger.error("PVote.add - pvotes does not exist");
        if(!it[itemId]) {
            return logger.error("PVote.add - itemId does not exist", itemId);
        }
        it=it[itemId];
        if(it.pending) return logger.error("PVote.add - itemId pending", itemId);
        if(!it.totals) {
            debugger
            return logger.error("PVote.add - itemId totals does not exist", itemId);
        }
        let itemTotals=it.totals;
        if(!it[userId]) return logger.error("PVote.add - userId does not exist", userId, "for itemId:",itemId);
        if(it.pending && it.pending.length && it[userId] && it[userId].pending && it[userId].pending.length)
            return logger.error("PVote.add - userId:", userId, "is pending for itemId:",itemId);
        
        it=it[userId];

        if (lastId.toString() <= it.lastId.toString()){
            logger.error("PVote.add:", { pvote }, "time:",ObjectID(lastId).getTimestamp(),  "is the same or older than", { it }, "time", ObjectID(it.lastId).getTimestamp(), "not updating")
            return;
        }
        if(criteria === it.criteria){ // user is not changing the vote
            it.lastId=lastId;
            return;
        }
        PVote.decrementTotals(itemTotals,it.criteria);
        Object.assign(it,{criteria, lastId});
        PVote.incrementTotals(itemTotals,criteria);
        return;
    }

    // when a user votes, first you have to subtract his old vote from the totals
    static decrementTotals(it,criteria){
        if(criteria===null) return; // if decrement-ing nullVote - just return;
        if(typeof it[criteria] === 'undefined') return;
        if(it[criteria].count===0) return;
        it[criteria].count-=1;
        return;
    }

    // after a user votes, increment the totals
    static incrementTotals(it,criteria){
        if(typeof it[criteria]==='undefined'){
            it[criteria]={count: 1};
            return;
        }
        it[criteria].count+=1;
        return;
    }

    static processUserInfoPending(it,update){
        if(it.pending && it.pending.length){
            while(it.pending && it.pending.length)
                it.pending.shift()();
            it.pending=undefined;
            if(update) update();
        }else {
            it.pending=undefined;
            if(update) update();
        }
    }

    // initialize the structure, and initialize the item if it isn't already - returns a promise so you can await on it that resolves to an pvote item structure with totals, and user last vote populated
    static prepItem(itemId,userId){
        var it=PVote.pvotes;
        if(!it)
            it=PVote.pvotes={};
        if(it[itemId]){
            it=it[itemId];
            if(!userId) userId='unknown';
            if(it.totals && it[userId] && !it[userId].pending) // if no user, or the user info has been added completely
                return Promise.resolve(it);
            else if(it.totals && it[userId]) // pending is set
                return new Promise(async (ok,ko)=>{
                    it[userId].pending.push(()=>ok(it))
                })                
            else if(it.totals){ // userId is not set - the item has been setup - so users can be setup independently
                it[userId]={pending: []}
                return new Promise(async (ok,ko)=>{
                    it[userId].pending.push(()=>ok(it))
                    var userInfo=await PVote.getLastVote(itemId,userId);
                    Object.assign(it[userId],userInfo);
                    PVote.processUserInfoPending(it[userId])
                })
            } else { // itemId is set but totals is not set - meaning the item is not setup 
                if(!it.pending) {
                    console.info("PVote.prepItem no totals and no pending");
                    return;
                }
                if(it[userId] && !it[userId].pending){
                    console.info("PVote.prepItem totals not set, userId set, but pending not set")
                    return;
                }else if(it[userId]){ // the user has tried to setup before
                    return new Promise(async (ok,ko)=>{
                        it.pending.push(()=>ok(it))
                    })
                }else { // user has not been here before
                    it[userId]={pending: []}
                    return new Promise(async (ok,ko)=>{
                        it.pending.push(()=>ok(it));
                        var userInfo=await PVote.getLastVote(itemId,userId);
                        Object.assign(it[userId],userInfo);
                        if(it[userId].pending && it[userId].pending.length){
                            //console.error("PVote.prepItem totals not set, user not set, but now stuff in user pending")
                            PVote.processUserInfoPending(it[userId])
                            return;
                        }else
                            it[userId].pending=undefined;                     
                    })
                }
            }
        } else { // the item has not been setup yet
            it[itemId]={pending: []};
            it=it[itemId];
            it[userId||'unknown']={pending: []};
            if(userId) it['unknown']={pending: []}; // in case any request come along before the info is complete
            return new Promise(async (ok,ko)=>{
                it.pending.push(()=>ok(it))
                var results= await PVote.getTotals(itemId, userId);
                var ownVote=results._ownVote;
                if(userId){
                    if(!ownVote)
                        ownVote=nullVote();
                    else
                        delete results._ownVote;
                }
                if(ownVote)
                    Object.assign(it[userId],ownVote);
                PVote.setTotals(itemId,results);
                if(userId){
                    if(it[userId] && it[userId].pending.length){
                        logger.error("PVote.prepItem after item and user setup, user has pending call backs")
                        it.pending.push(()=>{
                            PVote.processUserInfoPending(
                                it[userId],
                                ()=>io.sockets.in(itemId).emit(EVENT,it['totals'])
                            )
                        })
                    }else
                        it[userId].pending=undefined;
                }
                if(it['unknown'].pending && it['unknown'].pending.length){
                    logger.error("PVote.prepItem after item and user setup, unknown has pending call backs")
                    it.pending.push(()=>{
                        PVote.processUserInfoPending(
                            it['unknown'],
                            ()=>io.sockets.in(itemId).emit(EVENT,it['totals'])
                        )
                    })
                }else
                    it['unknown'].pending=undefined;
                PVote.processUserInfoPending(
                    it,
                    ()=>io.sockets.in(itemId).emit(EVENT,it['totals'])
                )
            })
        }
    }

    // external entry
    static subscribe(itemId,userId,socket){
        async function subscribeIt(){
            await PVote.prepItem(itemId,userId);
            socket.join(itemId); // join this user into the socket.io room related to this item
            setTimeout(()=>socket.emit(EVENT, PVote.pvotes[itemId].totals )) // we only need to update this user, after this op returns so the user is ready to receive
        }
        subscribeIt()
    }

    
    // external entry
    static insert(pvote){
        const userId=pvote.user;
        if(!userId) throw("PVote.insert user must be defined",pvote);
        if(!pvote._id) pvote._id=ObjectID();
        async function asyncInsert(){
            var it=await PVote.prepItem(pvote.item,pvote.user)
            if(it.pending){ // the items is being step
                it.pending.push(()=>PVote.post(pvote))
                console.info("PVote.insert on item pending:", it.pending.length);
            }else if(it[userId].pending ) {// item has been createdon, but the user is new under that item
                it[userId].pending.push(()=>PVote.post(pvote))
                //console.info("PVote.insert on user pending:", it[userId].pending.length);
            }else
                PVote.post(pvote);
        }
        asyncInsert()
    }

    // wait for all the pending items to be processed and then call the callback
    // caution this isn't working yet - use pollPending
    static flush(){
        if(PVote.flushing){
            logger.error("PVote.flush already flushing");
            return;
        }
        PVote.flushing=true;
        var promises=[];
        var it=PVote.pvotes;
        if(!it) return Promise.resolve(null);
        PVote.pollPending();
        Object.keys(it).forEach(itemId=>{
            Object.keys(it[itemId]).forEach(userId=>{
                if(userId==='totals') return;
                if(it[itemId][userId].pending){
                    promises.push(new Promise((ok,ko)=>{
                        var reOk = ()=>{
                            if(it[itemId][userId].pending && it[itemId][userId].pending.length)
                                it[itemId][userId].pending.push(reOk)
                            else
                                return ok();
                        }
                        it[itemId][userId].pending.push(reOk)
                    }))
                }
            })
        })
        return new Promise((ok,ko)=>{
            Promise.all(promises).then(()=>{
                PVote.flushing=false;
                ok()
            })
        })
    }

    static pollPending(){
        return new Promise(ok=>{
            var poll=()=>{
                let pending=0;
                Object.keys(PVote.pvotes).forEach(itemId=>{
                    if(PVote.pvotes[itemId].pending)
                        pending+=PVote.pvotes[itemId].pending.length;
                    Object.keys(PVote.pvotes[itemId]).forEach(userId=>{
                        if(userId==='pending' || userId=='totals') return;
                        if(PVote.pvotes[itemId][userId].pending)
                            pending+=PVote.pvotes[itemId][userId].pending.length;
                    })
                })
                if(pending) {
                    console.info("PVote.poll items still pending:",pending)
                    setTimeout(()=>poll(),1000)
                }else
                    return ok();
            }
            poll();
        })
    }
}

