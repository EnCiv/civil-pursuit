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
              this.__populated.type.populate().then(
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

                            // const { harmony } = this.__populated.type.__populated;
                            //
                            // if ( harmony ) {
                            //   this.__populated.type.set('harmony', harmony);
                            // }

                            item.type       =   this.__populated.type;

                            item.harmony.types = this.__populated.type.__populated.harmony;

                            // if ( harmony ) {
                            //   delete item.type.harmony;
                            //   item.type.harmony = harmony;
                            // }

                            item.user       =   this.__populated.user;

                            if ( typeof item.parent === 'undefined' ) {
                              delete item.parent;
                            }

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
