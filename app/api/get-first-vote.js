'use strict';

import DB from '../lib/util/db';

/**
 * Get the _id of the first vote by user, item _id, and criteria
 */

const COLL="pvote" // Collection Name

export default async function getFirstVote(item,criteria,cb){ // item is the item's _id here
    try {
        const user=this.synuser && this.synuser.id;
        if(!user) return cb(false);
        const query={item, user, criteria};
        var result=await DB.db.collection(COLL).find(query).sort({_id: 1}).limit(1).toArray().catch(err=>Logger.err("getFirstVote of", query, "caught error:", err));
        cb(result && result.length && result[0]._id.toString() || false);
    }
    catch(err){
        logger.error("getFirstVote caught error:", err);
        cb(false);
    }
}
