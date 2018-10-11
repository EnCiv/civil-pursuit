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
              (err)=>{if(typeof cb === 'function') cb(); this.error(err)}
            )
        }
        catch ( err ) {
          if(typeof cb === 'function') cb(); this.error(err)
        }
      },
      (err)=>{if(typeof cb === 'function') cb(); this.error(err)}
    );
  }
  catch ( err ) {
    if(typeof cb === 'function') cb(); this.error(err)
  }
}

export default createItem;
