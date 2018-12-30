'use strict';

import { Logger } from 'log4js/lib/logger';
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

const ids=['userId','itemId','_id'];

export class SubscribeQvoteInfo {
    static toMongo(qvote){
        for(k in ids){
            if(qvote[k] && typeof qvote[k]==='string')
                qvote[k]=ObjectID(qvote[k])
        }
    }

    static toJSON(qvote){
        for(k in ids){
            if(qvote[k]&&typeof qvote[k]==='object')
                qvote[k]=qvote[k].toString()
        }
    }

    static post(qvote){
        SubscribeQvoteInfo.toMongo(qvote);
        DB.db.collection("qvote").insert(qvote).error(err=>Logger.error("SubscribeQvoteInfo.post error:", qvote, err));
    }

    static getLastVote(itemId,userId){
        return new Promise((ok,ko)=>{
            DB.db.collection("qvote").aggregate([
                { $match: {item: itemId, user: userId}},
                { $sort: {_id: 1 } },
                { $group: { _id: {user: "$user", item: "$item"},
                            criteria: {$last: "$criteria"},
                            lastId: {$last: '$_id'}
                         }
                },
            ]).toArray((err,arr)=>{
                if(err){
                    console.error("SubscribeQvoteInto.getLastVote error", itemId,userId,err);
                    return ok({})
                }
                var result={criteria: arr[0].criteria, lastId: arr[0].lastId};
                return ok(result);
            })
        })
    }

    static getTotals(itemId, userId){
        return new Promise((ok,ko)=>{
            DB.db.collection("qvote").aggregate([
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
                if(err)ko(err);
                var result={};
                for(let qv of arr){
                    if(qv._ownVote) {
                        result._ownVote={criteria: qv.criteria, lastId: qv.lastId}
                        if(result[qv.criteria]){
                            result.qv.criteria.count+=1;
                        }else{
                            result[qv.criteria]={count: 1}
                        }
                    } else {
                        if(result[qv.criteria])
                            result[qv.criteria]+=qv.count;
                        else
                            result[qv.criteria]={count: qv.count};
                    }
                }
                ok(result)
            })
        })
    }

    // set the totals for the item, based on the totals obtained from the DB and if a user's ownVote is included add the users votes
    static setTotals(itemId,totals){
        if(!SubscribeQvoteInfo.qvotes){ // first time through
            SubscribeQvoteInfo.qvotes={[itemId]: {totals}}
            return;
        }
        let it=SubscribeQvoteInfo.qvotes;
        if(!it[itemId]){
            it[itemId]={totals};
            return;
        }
        it=it[itemId];
        if(!it.totals){
            it.totals=totals;
            return;
        }
        it=it.totals;
        let c;
        for(c in totals){
            if(it[c]){
                if(it[c].count!==totals[c].count){
                    Logger.error("SubscribeQvoteInfo.setTotals difference detected",it,results)
                    it[c].count=totals[c].count
                } // else they are the same so do nothing
            }else{
                it[c]={count: totals[c].count}
            }
        }
    }

    // add a user's votes to the local structure - create anything the doesn't exist along the way
    static add(qvote) {
        let lastId=qvote._id;
        let itemId=qvote.item;
        let userId=qvote.user;
        let criteria=qvote.criteria;

        if(!SubscribeQvoteInfo.qvotes){ // first time through
            SubscribeQvoteInfo.qvotes={[itemId]: {[userId]: {criteria, lastId},
                                                  totals:   {criteria: criteria, count: 1}
                                                 }
                                      };
            return;
        }
        let it=SubscribeQvoteInfo.qvotes;
        if(!it[itemId]){
            it[itemId]={[userId]: {criteria, lastId}}
            incrementTotals(itemId,criteria) // user not here before, so don't decrement old vote
            return;
        }
        it=it[itemId];
        if(!it[userId]){
            it[userId]={criteria, lastId}
            incrementTotals(itemId,criteria) // user not here before, so don't decrement old vote
            return;
        }
        it=it[userId];
        if (it.criteria !== criteria) { // user is changing it (the vote)
            if (ObjectID(lastId).getTimestamp() <= ObjectID(it.lastId).getTimestamp()){
                Logger.error("SubscribeQvoteInfo:", { qvote }, "is older than", { it }, "not updating")
                return;
            }
            decrementTotals(itemId,criteria);
            it={criteria, lastId};
            incrementTotals(itemId,criteria);
            return;
        } else { // user is not really changing the vote
            return;
        }
    }

    // when a user votes, first you have to subtract his old vote from the totals
    static decrementTotals(itemId,criteria){
        let it=SubscribeQvoteInfo.qvotes[itemId];
        if(!it.totals){
            it.totals={[criteria]: {count: 0}}
            return;
        }
        it=it.totals;
        if(!it[criteria] || !it[criteria].count){
            it[criteria]={count: 0};
            return;
        }
        it[criteria].count-=1;
        return;
    }

    // after a user votes, increment the totals
    static incrementTotals(itemId,criteria){
        let it=SubscribeQvoteInfo.qvotes[itemId];
        if(!it.totals){
            it.totals={[criteria]: {count: 1}}
            return;
        }
        it=it.totals;
        if(!it[criteria]){
            it[criteria]={count: 1};
            return;
        }
        it[criteria].count+=1;
        return;
    }

    // initialize the structure, and initialize the item if it isn't already - returns a promise so you can await on it that resolves to an qvote item structure with totals, and user last vote populated
    static prepItem(itemId,userId){
        var it=SubscribeQvoteInfo.qvotes;
        if(!it)
            it=SubscribeQvoteInfo.qvotes={};
        if(it[itemId]){
            if(!userId || (it[itemId][userId] && !it[itemId][userId].pending)) // if no user, or the user info has been added completely
                return Promise.resolve(it[itemId]);
            else { // there is a userId but the user data is not there yet
                it=it[itemId]
                return new Promise(async (ok,ko)=>{
                    if(it[userId]){ // pending
                        it[userId].pending.push(()=>ok(it)) // we just have to wait our turn
                        return;
                    } else { // userId not on item yet
                        it[userId]={pending: []}
                        var userInfo=await SubscribeQvoteInfo.getLastVote(itemId,userId);
                        var pending=it[userId].pending;
                        Object.assign(it[userId],userInfo);
                        it[userId].pending=undefined;
                        if(pending.length){
                            setTimeout(()=>{while(pending.length) pending.shift()()}) // resolve all the later ones, after the initial one resolves
                        }
                        return ok(it)
                    }
                })
            }
        } else {
            it[itemId]={pending: []}; // the existence pending list (even if empty) is a semaphore to prevent multiple preps of the Item
            return new Promise(async (ok,ko)=>{
                var results= await SubscribeQvoteInfo.getTotals(itemId, userId);
                if(results._ownVote) {
                    it[itemId][userId]={criteria: results._ownVote.criteria, lastId: results._ownVote.lastId};
                    delete results._ownVote;
                } else if(userId) // user has no vote
                    it[itemId][userId]={criteria: null, lastId: ObjectID.createFromTime(1)}
                SubscribeQvoteInfo.setTotals(itemId,results);
                if(it[itemId].pending && !it[itemId].pending.length){
                    it[itemId].pending=undefined; // the item is setup, release the semaphore
                }
                return ok(it[itemId])
            })
        }
    }

    // after processing an action, check the pending queue and run what's there first, then emit the qvoteInfo to the clients
    static processPending(itemId){
        var it=SubscribeQvoteInfo.qvotes[itemId];
        if(it.pending && it.pending.length){
            return it.pending.shift()();
        } else {
            it.pending=undefined
            io.sockets.in(itemId).emit('qvoteInfo',SubscribeQvoteInfo.qvotes[itemId]['totals'])
        }
    }

    // external entry
    static subscribeInfo(itemId,userId,socket){
        async function subscribe(){
            await SubscribeQvoteInfo.prepItem(itemId,userId);
            socket.join(itemId); // join this user into the socket.io room related to this item
            setTimeout(()=>socket.emit('qvoteInfo', SubscribeQvoteInfo.qvotes[itemId].totals )) // we only need to update this user, after this op returns so the user is ready to receive
        }
        subscribe()
    }

    
    // external entry
    static insert(qvote){
        async function asyncInsert(){
            var it=await SubscribeQvoteInfo.prepItem(qvote.item,qvote.user)
            if(it.pending ) // if pending exists but is empty, a previous call to prepItem is awaiting totals - so start pushing 
                it.pending.push(()=>this.insertIt(qvote))
            else
                this.insertIt(qvote);
        }
        asyncInsert()
    }

    // really insert the entry
    static insertIt(qvote) {
        SubscribeQvoteInfo.add(qvote);
        SubscribeQvoteInfo.post(qvote);
        return SubscribeQvoteInfo.processPending(qvote.item);
    }

    // wait for all the pending items to be processed and then call the callback
    static flush(){
        var promises=[];
        var it=SubscribeQvoteInfo.qvotes;
        if(!it) return Promise.resolve(null);
        Object.keys(it).forEach(itemId=>{
            if(it[itemId].pending){
                promises.push(new Promise((ok,ko)=>{
                    it[itemId].pending.push(()=>{
                        var it=SubscribeQvoteInfo.qvotes[itemId];
                        io.sockets.in(itemId).emit('qvoteInfo',it['totals'])
                        if(it.pending && it.pending.length) setTimeout(()=>it.pending.shift()())
                        return ok()
                    });
                }))
                Object.keys(it[itemId]).forEach(userId=>{
                    if(userId==='totals') return;
                    if(it[itemId][userId].pending){
                        promises.push(new Promise((ok,ko)=>{
                            it[itemId][userId].pending.push(ok)
                        }))
                    }
                })
            }
        })
        return new Promise((ok,ko)=>{
            Promise.all(promises).then(ok)
        })
    }
}


export default SubscribeQvoteInfo
