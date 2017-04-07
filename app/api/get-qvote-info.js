'use strict';

import QVote from '../models/qvote';

function getQVoteInfo (itemId, own, cb) {
 const user= own ? (this.synuser ? this.synuser.id : null) : null;
 if(own && !user) cb([]); // return nothing
 else
  QVote.getAccumulation(itemId, user)
    .then(results => {
        if(!results){cb([])}  // return nothing
        else cb(results);
    })
    .catch(this.error.bind(this));
}


export default getQVoteInfo;
