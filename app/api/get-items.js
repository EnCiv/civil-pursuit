'use strict';

import Item from '../models/item';

function getItems (panel, cb) {
  try {
    let id        =   'panel-' + panel.type._id || panel.type;
    const query   =   { type : panel.type._id || panel.type};
    const userId = this.synuser ? this.synuser.id : null;


    if ( panel.parent ) {
      id += '-' + panel.parent;
      query.parent = panel.parent;
    }

    if ( panel.skip ) {
      query.skip = panel.skip;
    }

    if(panel.size) {
      query.size = panel.size;
    }

    Item
      .getPanelItems(query, userId)
      .then(
        results => {
          try {
            if(!panel.items) { panel.items = []; }
            panel.items = panel.items.concat(results.items);
            cb(panel, results.count);
          }
          catch ( error ) {
            ko(error);
          }
        },
        this.error.bind(this)
      );
  }

  catch ( error ) {
    this.error(error);
  }

}

export default getItems;
