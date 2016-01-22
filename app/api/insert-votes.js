'use strict';

import Vote from '../models/vote';

function insertVotes (votes) {
  Vote
    .create(votes.map(vote => {
      vote.user = this.synuser.id;

      return vote;
    }))
    .then(() => {})
    .catch(this.error.bind(this))
}

export default insertVotes;
