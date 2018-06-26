'use strict';

import apiWrapper from '../lib/util/api-wrapper';

function getObjectId(cb){
  return apiWrapper.Immediate.call(this,['get object id', cb]);
}

export default getObjectId;
