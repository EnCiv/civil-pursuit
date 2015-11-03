'use strict';

import config             from '../../../../public.json';
import toSlug             from '../../../lib/util/to-slug';

function toPanelItem () {
  return new Promise((ok, ko) => {
    try {
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      this
        .populate()
        .then(
          () => {
            try {
              //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

              const {
                _id,              /** ObjectID **/
                parent,           /** ObjectID **/
                id,               /** String **/
                subject,          /** String **/
                description,      /** String **/
                image,            /** String **/
                references,       /** [{ title: String, url: String }] **/
                views,            /** Number **/
                promotions,       /** Number **/
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

              //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

              item.image        =   item.image || config['default item image'];
              item.popularity   =   this.getPopularity();
              item.link         =   `/item/${id}/${toSlug(subject)}`;

              //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

              Promise
                .all([
                  this.getLineage(),
                  this.__populated.type.getSubtype(),
                  this.countVotes(),
                  this.countChildren(),
                  this.countHarmony()
                ])
                .then(
                  results => {
                    try {
                      item.lineage    =   results[0];
                      item.subtype    =   results[1];
                      item.votes      =   results[2];
                      item.children   =   results[3];
                      item.harmony    =   results[4];

                      item.type       =   this.__populated.type;
                      item.user       =   this.__populated.user;

                      ok(item);
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

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }

    catch ( error ) {
      ko(error);
    }

  });
}

export default toPanelItem;
