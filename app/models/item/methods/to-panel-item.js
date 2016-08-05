'use strict';

import config             from '../../../../public.json';
import sequencer          from 'promise-sequencer';

function toPanelItem (userId) {

  return sequencer.pipe(

    () => this.populate(),

    () => this.$populated.type.populate(),

    () => Promise.all([
      this.$populated.type.getSubtype(),
      this.countVotes(),
      this.countChildren(),
      this.countHarmony(),
      this.countUpvote(userId)
    ]),

    results => new Promise((ok, ko) => {
      const {
        _id,              /** ObjectID **/
        parent,           /** ObjectID **/
        id,               /** String **/
        subject,          /** String **/
        description,      /** String **/
        image,            /** String **/
        references,       /** [{ title: String, url: String }] **/
        views,            /** Number **/
        promotions       /** Number **/
      } = this;

      const item = {
        _id,
        id,
        subject,
        description,
        image,
        references,
        views,
        promotions,
        parent
      };

      item.image        =   item.image || config['default item image'];
      item.popularity   =   this.getPopularity();

      item.subtype    =   results[0];
      item.votes      =   results[1];
      item.children   =   results[2];
      item.harmony    =   results[3];
      item.upvote     =   results[4];

      item.type       =   this.$populated.type;

      if ( 'harmony' in this.$populated.type.$populated ) {
        item.harmony.types = this.$populated.type.$populated.harmony;
      }

      item.user       =   this.$populated.user;

      if ( typeof item.parent === 'undefined' ) {
        delete item.parent;
      }

      ok(item);
    })

  );
}

export default toPanelItem;
