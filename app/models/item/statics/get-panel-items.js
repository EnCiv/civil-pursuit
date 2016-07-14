'use strict';

import sequencer from 'promise-sequencer';
import publicConfig from '../../../../public.json';

/**
 *  Return an object representing a batch of items with the following structure;
 *  { count : Number , items : [PanelItem] }
 *  @count
 *  The number of items loaded. This gets incremented every time a new panel is loaded (#TODO: do we really need that since we can do a `items.length`?)
 *  @items
 *  The loaded panel items in the batch
*/

function getPanelItems (panel, userId) {
  console.info("getPanelItems", panel, userId)
  const query = { type : panel.type };

  if ( panel.parent ) {
    query.parent = panel.parent;
  }

  const seq = [];

  seq.push(() => {let count = this.count(query); console.info("getPaneItems.count", count); return(count)} );

  seq.push(count => this.find(query)
    .skip(panel.skip || 0)
    .limit(panel.size || publicConfig['navigator batch size'])
    .sort({ promotions : -1, views : -1, _id : -1 })
  );

  seq.push(items => Promise.all(items.map(item => item.toPanelItem(userId))));

  console.info("getPanelItems before promise", seq);

  return new Promise((ok, ko) => {
    console.info("getPanelItems: before sequencer");
    sequencer(seq)
      .then(results => { console.info("getPanelItems sequencer then"); ok({ count : results[0], items : results[2] }); })
      .catch( error => { console.info("getPanelItems sequencer catch"); ko });
  });
}

export default getPanelItems;
