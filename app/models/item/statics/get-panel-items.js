'use strict';

import config from '../../../../config.json';

function getPanelItems (panel) {
  return new Promise((ok, ko) => {
    try {
      let ItemModel = this;

      let query = {};

      for ( let i in panel ) {
        if ( i !== 'skip' ) {
          query[i] = panel[i];
        }
      }

      if ( ! panel.item ) {
        ItemModel
          .find(query)
          .skip(panel.skip || 0)
          .limit(panel.size || config.public['navigator batch size'])
          .sort({ promotions: -1 })
          .exec()
          .then(
            items => {
              try {
                Promise
                  .all(items.map(item => item.toPanelItem()))
                  .then(ok, ko);
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default getPanelItems;
