'use strict';

import apiWrapper from '../lib/util/api-wrapper';

function insertQVote(vote, cb){
  return apiWrapper.Push.call(this,['insert qvote', vote], cb)
}

export default insertQVote;
