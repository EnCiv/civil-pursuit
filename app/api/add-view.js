'use strict';

import ItemModel from '../models/item';

function addView (event, itemId) {
  try {
    ItemModel
      .incrementView(itemId)
      .then(
        item => {
          this.ok(event, item.views);

          let changed = {
            views       :   item.views,
            popularity  :   item.getPopularity()
          };

          this.emit('Item changed', item._id, changed);

          this.broadcast.emit('Item changed', item._id, changed);
        },
        error => { this.error(error) }
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default addView;
