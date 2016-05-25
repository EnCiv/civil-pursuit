'use strict';

import Upvote from '../models/upvote';

function insertUpvotes (upvotes) {
  Upvote
    .create(upvotes.map(upvote => {
      upvote.user = this.synuser.id;
      upvote.date = new date();

      return upvote;
    }))
    .then(() => {})
    .catch(this.error.bind(this))
}

export default insertUpvotes;
