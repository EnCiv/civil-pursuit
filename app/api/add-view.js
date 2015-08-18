'use strict';

import ItemModel from '../models/item';

function addView (event, itemId) {
  try {
    ItemModel
      .incrementView(itemId)
      .then(
        item => {
          this.ok(event, item.views);

          item
            .toPanelItem()
            .then(
              item => {
                this.emit('item changed', item);
                this.broadcast.emit('item changed', item);
              }
            );
        },
        error => { this.error(error) }
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default addView;
