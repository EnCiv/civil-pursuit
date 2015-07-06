'use strict';

import ItemModel from '../models/item';

function getItemDetails (event, itemId) {
  try {
    ItemModel
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
