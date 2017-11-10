'use strict';

import Item from '../models/item';
import Mungo from 'mungo';

function createItem (item, cb) {
  try {
    item.user = Mungo.mongodb.ObjectID(this.synuser.id);

    Item.create(item).then(
      item => {
        try {
          item
            .toPanelItem()
            .then(
              item => {
                if(typeof cb === 'function') cb(item);
                this.emit('OK create item', item);
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
