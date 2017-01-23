'use strict';

import Upvote from '../models/upvote';

function insertUpvote (upvoten) {
 if(!(this.synuser  && this.synuser.id)) return; // can't vote if your not a users (and don't cause an error if you try)
  Upvote
    .create(upvoten.map(upv => {
      upv.user = this.synuser.id;
      upv.date = new Date();

      return upv;
    }))
    .then(() => {})
    .catch(this.error.bind(this))
}

export default insertUpvote;
