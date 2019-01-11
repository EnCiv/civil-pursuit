'use strict';

import apiWrapper from '../lib/util/api-wrapper';

function insertPvote(vote, cb){
  return apiWrapper.Push.call(this,['insert pvote', vote], cb)
}

export default insertPvote;
