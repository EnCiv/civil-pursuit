'use strict';

import apiWrapper from '../lib/util/api-wrapper';

function updateItem (item, cb) {
  return apiWrapper.Push.call(this,['update item', item],cb)
}

export default updateItem;