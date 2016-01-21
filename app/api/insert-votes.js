'use strict';

import VoteModel from '../models/vote';

function insertVotes (votes) {
  VoteModel.create(votes);
}

export default insertVotes;
