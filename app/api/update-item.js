'use strict';

import Item from '../models/item';
import Mungo from 'mungo';

function updateItem (item) {
  try {
    item.user = Mungo.mongodb.ObjectID(this.synuser.id);
    let id=Mungo.mongodb.ObjectID(item._id)

    Item.updateById(id, item).then(
      item => {
        try {
          item
            .toPanelItem()
            .then(
              item => {
                this.emit('item changed', item);
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

export default updateItem;
