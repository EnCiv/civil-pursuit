'use strict';

import config             from '../../../../public.json';
import toSlug             from '../../../lib/util/to-slug';
import Type               from '../../type';
import User               from '../../user';
import Vote               from '../../vote';

function toPanelItem () {
  return new Promise((ok, ko) => {
    try {
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      const Item = this.constructor;

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      const {
        _id,              /** ObjectID **/
        id,               /** String **/
        subject,          /** String **/
        description,      /** String **/
        image,            /** String **/
        references,       /** [{ title: String, url: String }] **/
        views,            /** Number **/
        promotions        /** Number **/
      } = this;

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      const item = {
        _id,
        id,
        subject,
        description,
        image,
        references,
        views,
        promotions
      };

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      item.image        =   item.image || config['default item image'];
      item.popularity   =   this.getPopularity();
      item.link         =   `/item/${id}/${toSlug(subject)}`;

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      const getType     =   () => new Promise((ok, ko) => {
        try {
          Type
            .findById(this.type, { populate : 'harmony' })
            .then(ok, ko);
        }
        catch ( error ) {
          ko(error);
        }
      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      const getUser     =   () => new Promise((ok, ko) => {
        try {
          User
            .findById(this.user)
            .then(
              user => {
                try {
                  if ( ! user ) {
                    throw new Error('User not found: ' + this.user);
                  }
                  const { gps, _id } = user;
                  ok({ 'full name' : user.fullName, gps, _id });
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
      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      const getSubtype      =   () => new Promise((ok, ko) => {
        try {
          Type
            .find({ parent : this.type })
            .then(
              types => {
                try {
                  if ( ! types.length ) {
                    return ok(null);
                  }
                  const promises = types.map(type => type.isHarmony());
                  Promise
                    .all(promises)
                    .then(
                      results => {
                        try {
                          const subtype = results.reduce(
                            (subtype, isHarmony, index) => {
                              if ( ! isHarmony ) {
                                subtype = types[index];
                              }
                              return subtype;
                            }, null);

                          ok(subtype);
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
              ko);
        }
        catch ( error ) {
          ko(error);
        }
      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      const countChildren   =   () => new Promise((ok, ko) => {
        try {
          Item
            .count({ parent : this })
            .then(ok, ko);
        }
        catch ( error ) {
          ko(error);
        }
      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      const countVotes      =   () => new Promise((ok, ko) => {
        try {
          Vote
            .count({ item })
            .then(ok, ko);
        }
        catch ( error ) {
          ko(error);
        }
      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      Promise
        .all([
          this.getLineage(),
          getType(),
          getUser(),
          getSubtype(),
          countVotes(),
          countChildren(),
          this.countHarmony()
        ])
        .then(
          results => {
            try {
              item.lineage    =   results[0];
              item.type       =   results[1];
              item.user       =   results[2];
              item.subtype    =   results[3];
              item.votes      =   results[4];
              item.children   =   results[5];
              item.harmony    =   results[6];

              ok(item);
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
