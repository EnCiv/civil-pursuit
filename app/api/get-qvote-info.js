'use strict';

import QVote from '../models/qvote';

function getQVoteInfo (itemId, own, cb) {
 const user= own ? this.synuser.id : null;

  QVote.getAccumulation(itemId, user)
    .then(results => cb(results.toJSON()))
    .catch(this.error.bind(this));
}


export default getQVoteInfo;
