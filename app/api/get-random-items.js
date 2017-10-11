'use strict';

import Item from '../models/item';

function getRandomItems (panel, size, cb) {
  try {
    let id        =   'panel-' + panel.type._id || panel.type;
    const query   =   { type : panel.type._id || panel.type};
    const userId = this.synuser ? this.synuser.id : null;


    if ( panel.parent ) {
      const parentId = panel.parent._id || panel.parent; 
      id += '-' + parentId;
      query.parent = parentId;
    }

    if ( panel.skip ) {
      query.skip = panel.skip;
    }

    if(panel.limit) {
      query.limit = panel.limit;
    }

    if(panel.own) {
      if(userId) {
        query.user = userId;
      } else {
        cb(panel, 0); // request to get the users's own items but no user logged in so return nothing
      }
    }

    Item
      .getRandomItems(query, size, userId)
      .then(
        results => {
          try {
            if(!panel.items) { panel.items = []; }
            panel.items = panel.items.concat(results.items);
            cb(panel);
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

export default getRandomItems;
