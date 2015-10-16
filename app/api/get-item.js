'use strict';

import ItemModel from '../models/item';

function getItemById (event, query) {
  try {
    ItemModel
      .findOne(query)
      .exec()
      .then(
        item => {
          try {
            item
              .toPanelItem()
              .then(
                item => {
                  this.ok(event, item);
                },
                this.error.bind(this)
              )
          }
          catch ( error ) {
            this.error(error);
          }
        },
        this.error.bind(this)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default getItemById;
