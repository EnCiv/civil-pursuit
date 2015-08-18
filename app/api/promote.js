'use strict';

import ItemModel from '../models/item';

function promoteItem (event, itemId) {
  try {
    ItemModel
      .incrementPromotion(itemId)
      .then(
        item => {
          this.ok(event, item.promotions);

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

export default promoteItem;
