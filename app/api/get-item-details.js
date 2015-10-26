'use strict';

import Item from '../models/item';

function getItemDetails (event, itemId) {
  try {
    Item
      .getDetails(itemId)
      .then(
        details => this.ok(event, details),
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default getItemDetails;
