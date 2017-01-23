'use strict';

import Vote from '../models/vote';

function insertVotes (votes) {
 if(!(this.synuser  && this.synuser.id)) return; // can't vote if your not a users (and don't cause an error if you try)
  Vote
    .create(votes.map(vote => {
      vote.user = this.synuser.id;

      return vote;
    }))
    .then(() => {})
    .catch(this.error.bind(this))
}

export default insertVotes;
