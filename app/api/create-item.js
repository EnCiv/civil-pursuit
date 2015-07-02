'use strict';

import run from 'syn/lib/util/run';
import ItemModel from 'syn/models/item';

function createItem (event, item) {
  run(
    d => {
      item.type = item.type._id;
      item.user = this.synuser.id;

      ItemModel.insert(item, this).then(
        item => {
          item.toPanelItem((error, item) => {
            if ( error ) {
              return this.error(error);
            }
            this.ok(event, item);
          })
        },
        this.error.bind(this)
      );
    },
    
    this.error.bind(this)
  );
}

export default createItem;
