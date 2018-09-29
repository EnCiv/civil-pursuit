'use strict';

import Upvote from '../models/upvote';

function getUpvoteInfo (itemId, cb) {

  Upvote.getAccumulation(itemId, this.synuser.id)
    .then(results => cb(results && results.toJSON()))
    .catch(this.error.bind(this));
}


export default getUpvoteInfo;
