'use strict';

import apiWrapper from '../lib/util/api-wrapper';

function createItem (item, cb) {
  return apiWrapper.Push.call(this,['create item', item, cb])
}

export default createItem;