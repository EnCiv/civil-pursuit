'use strict';

import Item from '../models/item';

function promote (event, itemId) {
  try {
    Item
      .updateById(itemId, { $inc : { promotions : 1 } })
      .then(
        item => {
          try {
            this.ok(event, item.promotions);
          }
          catch ( error ) {
            ko(error);
          }
        },
        error => { this.error(error) }
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default promote;
