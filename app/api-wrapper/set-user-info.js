'use strict';

import apiWrapper from '../lib/util/api-wrapper';

function setUserInfo(set,cb){
  return apiWrapper.Update1OrPush.call(this,['set user info', set],cb)
}

export default setUserInfo;
