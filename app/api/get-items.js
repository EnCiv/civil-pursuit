'use strict';

import Item from '../models/item';
import Type from '../models/type';

function getItems (panel, cb) {
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
      .getPanelItems(query, userId)
      .then(
        results => {
          try {
            if(!panel.items) { panel.items = []; }
            panel.items = panel.items.concat(results.items);

            if(typeof panel.type !== 'object'){
              Type.findOne({_id: panel.type}).then(typeInfo=>{
                panel.type=typeInfo.toJSON();
                cb(panel, results.count);
              })
            }else 
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
