'use strict';

import apiWrapper from '../lib/util/api-wrapper';

function setUserInfo(set,cb){
  return apiWrapper.Push.call(this,['set user info', set, cb])
}

export default setUserInfo;
