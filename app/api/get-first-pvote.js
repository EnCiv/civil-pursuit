'use strict';

import Pvote from '../models/pvote';

/**
 * Get the _id of the first vote by user, item _id, and criteria
 */


export default async function getFirstVote(item,criteria,cb){ // item is the item's _id here
    try {
        const user=this.synuser && this.synuser.id;
        if(!user) return cb(false);
        const query={item, user, criteria};
        Pvote.getFirstVote(query,result=>{
            cb && cb(result && result.length && result[0]._id.toString() || false);
        });
    }
    catch(err){
        logger.error("getFirstVote caught error:", err);
        cb(false);
    }
}
