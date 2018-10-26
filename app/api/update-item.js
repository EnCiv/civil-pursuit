'use strict';

import Item from '../models/item';
import Mungo from 'mungo';

function updateItem (item, cb) {
  try {
    // mungo complains about extra properties that may be in the object, so we just delete them
		const schemaKeys = Object.keys(Item.schema).concat(['_id']);
		Object.keys(item).forEach(inputKey => schemaKeys.includes(inputKey) || delete item[inputKey]);

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
