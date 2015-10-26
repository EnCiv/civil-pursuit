'use strict';

import VoteModel from '../models/vote';

function insertVotes (event, votes) {
  try {
    if ( ! this.synuser ) {
      throw new Error('Must be logged in');
    }

    votes = votes.map(vote => {
      vote.user = this.synuser.id;
      return vote;
    });

    VoteModel
      .create(votes)
      .then(
        votes => {
          this.ok(event, votes);
        },
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default insertVotes;
