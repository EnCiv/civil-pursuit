'use strict';

import Item from '../models/item';
import Mungo from 'mungo';

function updateItem (item, cb) {
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
                if(typeof cb === 'function') cb(item);
                this.emit('item changed', item);
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

export default updateItem;
