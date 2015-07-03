'use strict';

import VoteModel from 'syn/models/vote';

function insertVotes (event, votes) {
  try {
    if ( ! this.synuser ) {
      throw new Error('Must be logged in');
    }

    votes = votes.map(vote => {
      vote.user = this.synuser.id;
      return vote;
    });

    console.log('creating votes', votes)

    VoteModel
      .create(votes)
      .then(
        votes => {
          console.log('got votes')
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
