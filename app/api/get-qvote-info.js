'use strict';

import QVote from '../models/qvote';

function getQVoteInfo (itemId, own, cb) {
 const user= own ? (this.synuser ? this.synuser.id : null) : null;
 if(own && !user) return; // nothing to do here

  QVote.getAccumulation(itemId, user)
    .then(results => {
        if(!results){return;}  // if no data then don't do the call back
        cb(results)
    })
    .catch(this.error.bind(this));
}


export default getQVoteInfo;
