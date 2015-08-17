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
                console.log('item changed', item)
                this.emit(`item changed ${item._id}`, item);
                this.broadcast.emit(`item changed ${item._id}`, item);
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
