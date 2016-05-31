'use strict';

import Upvote from '../models/upvote';

function insertUpvote (upvoten) {
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
