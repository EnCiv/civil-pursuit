'use strict';

import apiWrapper from '../lib/util/api-wrapper';

function subscribePvoteInfo(itemId, cb) {
  return apiWrapper.Push.call(this,['subscribe pvote info', itemId], success=>{
      if(success)
          window.socket.on('PvoteInfo',cb);
      cb(success)
  })
}

export default subscribePvoteInfo;
