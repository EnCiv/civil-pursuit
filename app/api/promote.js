'use strict';

import Item from '../models/item';

function promote (itemId) {
	console.info("api.promote itemId", itemId);
  Item.updateById(itemId, { $inc : { promotions : 1 } });
}

export default promote;
