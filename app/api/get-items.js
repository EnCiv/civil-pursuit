'use strict';

import ItemModel from 'syn/models/item';
import run from 'syn/lib/util/run';

function getItems (event, panel, item) {

  run(
    d => {
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

        .then(this.ok.bind(this, event, panel), error => {});
    },
    error => {}
  );

}

export default getItems;
