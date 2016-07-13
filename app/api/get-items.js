'use strict';

import Item from '../models/item';

function getItems (panel, cb) {
  try {
    console.info("getItems", panel, cb);
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

    Item
      .getPanelItems(query, userId)
      .then(
        results => {
          try {
            console.info("getItems results.count", results.count);
            cb(panel, results.count, results.items);
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
