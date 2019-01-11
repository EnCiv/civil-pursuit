'use strict';

import {ObjectID} from 'mongodb';
import DB from '../lib/util/db';
import Type from '../models/type';

/**
 * 
 * enter discussion
 * 
 * Get the itemId of the 'current' discussion for this item.
 * 'Current' means that the discussion started less than discussionStartWindow seconds ago.
 * If one does not exist, create it.
 * 
 */

const Items="items" // be consistent
const _DiscussionType="_DiscussionType"; // for consistency
var discussionTypeId; // looked up once on start

// store the lookup in memory, there will be many discussion participants lookup up the same thing
var DiscussionItemIds={};  // [_id]=_id; 

// init this module, and then enterDiscussion with the original parameters
async function initDiscussionId(itemId,duration,cb){
    try{
        var discussionType=await Type.findOne({name: _DiscussionType});
        if(!discussionType){ // the discussion type does not exist in the DB
            discussionTypeId=ObjectID();
            discussionType={_id: discussionTypeId, name: _DiscussionType, id: "_DSCS"};
            logger.info("enterDiscussion.initDiscussionId: creating ",discussionType)
            Type.insertOne(discussionType).catch(err=>logger.error("enterDiscussion.initDiscussion insertOne caught error:",err));
        }else
            discussionTypeId=discussionType._id;
        enterDiscussion(itemId,duration,cb)
    }
    catch(err){
        logger.error("enterDiscussion.initDiscussion caught error:", err);
    }
}

export default async function enterDiscussion(itemId,duration,cb){
    if(!discussionTypeId)
        return initDiscussionId(itemId,duration,cb); // init this module, and then call this function again with it's parameters
    try{
        const earliest=new Date().getTime()-duration;
        if(DiscussionItemIds[itemId] && DiscussionItemIds[itemId].getTimestamp()>=earliest){
            return cb(DiscussionItemIds[itemId]);
        } else {
            var result=await DB.db.collection(Items).find({parent: itemId, type: discussionTypeId}).sort({_id: -1}).limit(1).toArray();
            var discussionId;
            if(!result || !result.length || result[0]._id.getTimestamp()<earliest){ // no item, or item but too old
                discussionId=DiscussionItemIds[itemId]=ObjectID();
                DB.db.collection(Items).insertOne({_id: discussionId, parent: itemId, type: discussionTypeId}).catch(err=>logger.error("enterDiscussion insertOne caught error:",err)); 
            } else 
                discussionId=DiscussionItemIds[itemId]=result[0]._id;
            cb(discussionId);
        }
    }
    catch(err){
        logger.error("enterDiscussion caught error:",err);
    }
}


