'use strict';

import Item from '../models/item';

function addView (event, itemId) {
  try {
    Item
      .updateById(itemId, { $inc : { views : 1 } })
      .then(
        item => {
          try {
            this.ok(event, item.views);
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

export default addView;
