'use strict';

import ItemModel from '../models/item';

function createItem (event, item) {
  try {
    item.type = item.type._id;
    item.user = this.synuser.id;

    ItemModel.insert(item, this).then(
      item => {
        try {
          item
            .toPanelItem()
            .then(
              item => {
                this.ok(event, item);
              },
              error => this.error(error)
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

export default createItem;
