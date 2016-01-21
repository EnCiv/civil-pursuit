'use strict';

import Item from '../models/item';

function addView (itemId) {
  Item.updateById(itemId, { $increment : { views : 1 } });
}

export default addView;
