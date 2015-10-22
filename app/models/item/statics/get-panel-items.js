'use strict';

import publicConfig from '../../../../public.json';

/**
 *  Return an object representing a batch of items with the following structure;
 *  { count : Number , items : [PanelItem] }
 *  @count
 *  The number of items loaded. This gets incremented every time a new panel is loaded (#TODO: do we really need that since we can do a `items.length`?)
 *  @items
 *  The loaded panel items in the batch
*/


function getPanelItems (panel) {
  return new Promise((ok, ko) => {
    try {
      const query = {};

      for ( let i in panel ) {
        if ( i !== 'skip' ) {
          query[i] = panel[i];
        }
      }

      console.log({ panel, query })

      if ( ! panel.item ) {
        this
          .count(query)
          .then(
            count => {
              try {
                consold.log({ count })
                this
                  .find(query, {
                    skip : panel.skip || 0,
                    limit : panel.size || publicConfig['navigator batch size'],
                    sort : { promotions: -1 }
                  })
                  .then(
                    items => {
                      try {
                        console.log({ items });
                        Promise
                          .all(items.map(item => item.toPanelItem()))
                          .then(
                            items => ok({count, items}),
                            ko
                          );
                      }
                      catch ( error ) {
                        ko(error);
                      }
                    },
                    ko
                  );
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
