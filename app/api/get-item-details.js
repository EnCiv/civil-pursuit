'use strict';

import Item from '../models/item';

function getItemDetails (itemId) {
  Item
    .getDetails(itemId)
    .then(
      details => {
        this.emit('OK get item details', details)
      },
      error => this.error(error)
    );
}

export default getItemDetails;
