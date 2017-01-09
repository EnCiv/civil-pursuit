'use strict';

import Vote from '../models/qvote';

function insertQVote (vote) {
 var theVote=vote;
 theVote.user=this.synuser.id; // on the server side we add the userId.
  Vote
    .create(theVote)
    .then(() => {})
    .catch(this.error.bind(this))
}

export default insertQVote;
