'use strict';

import apiWrapper from '../lib/util/api-wrapper';

export default function enterDiscussion(itemId, duration, cb){
  return apiWrapper.Push.call(this,['enter discussion', itemId, duration], cb)
}

