'use strict';

import apiWrapper from '../lib/util/api-wrapper';

function insertQVote(vote){
  return apiWrapper.Push.call(this,['insert qvote', vote])
}

export default insertQVote;
