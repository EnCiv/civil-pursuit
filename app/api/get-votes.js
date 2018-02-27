'use strict';

import Vote from '../models/vote';

function getVotes (itemId, cb) {

    if(!this.synuser) cb(null); // no user loggedin, no feedback
    const query = {
      item      :   itemId,
      user      :   this.synuser.id,
    };

    Vote
      .find(query)
      .then(
        votes => cb(votes.map(vote=>vote.toJSON())),
        cb([])
        );
}

export default getVotes;
