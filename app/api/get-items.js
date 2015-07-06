'use strict';

import ItemModel from '../models/item';

function getItems (event, panel, item) {

  try {
    let id    = 'panel-' + panel.type._id || panel.type;
    let query = { type: panel.type._id || panel.type};

    if ( panel.parent ) {
      id += '-' + panel.parent;
      query.parent = panel.parent;
    }

    if ( panel.skip ) {
      query.skip = panel.skip;
    }

    ItemModel

      .getPanelItems(query)

      .then(this.ok.bind(this, event, panel), this.error.bind(this));
  }

  catch ( error ) {
    this.error(error);
  }

}

export default getItems;
