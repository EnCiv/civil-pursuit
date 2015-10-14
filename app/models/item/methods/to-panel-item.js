'use strict';

import config             from '../../../../public.json';
import toSlug             from '../../../lib/util/to-slug';
import calcHarmony        from '../../../lib/get-harmony';
import Type               from '../../type';
import User               from '../../user';
import Vote               from '../../vote';

function toPanelItem () {
  return new Promise((ok, ko) => {
    try {
      console.log('to panel item');
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
          console.log('get type');
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
            .count({ parent : _id })
            .then(ok, ko);
        }
        catch ( error ) {
          ko(error);
        }
      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      const countSubType    =   subtype => new Promise((ok, ko) => {
        try {
          let query = {
            parent    :   this._id,
            type      :   subtype
          };

          Item
            .count(query)
            .then(ok, ko);
        }
        catch ( error ) {
          ko(error);
        }
      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      const countHarmony    =   harmony => new Promise((ok, ko) => {
        try {
          if ( ! harmony.length ) {
            return ok(0);
          }

          const query = {
            parent    :   this._id,
            type      :   {
              $in     :   harmony.map(h => h._id)
            }
          };

          Item
            .count(query)
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
            .count({ item : this._id })
            .then(ok, ko);
        }
        catch ( error ) {
          ko(error);
        }
      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      const getHarmony      =   item => new Promise((ok, ko) => {
        try {
          let { harmony } = item.type;


          let promises = harmony.map(side =>
            new Promise((ok, ko) => {
              Item
                .count({
                  parent    :   item._id,
                  type      :   side._id
                })
                .then(ok, ko);
            })
          );

          Promise
            .all(promises)
            .then(
              results => {
                let [ pro, con ] = results;
                ok(calcHarmony(pro, con));
              },
              ko
            );
        }
        catch ( error ) {
          ko(error);
        }
      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      Promise
        .all([
          this.getLineage(),
          getType(),
          getUser(),
          getSubtype(),
          countVotes()
        ])
        .then(
          results => {
            try {
              [
                item.lineage,
                item.type,
                item.user,
                item.subtype,
                item.votes
              ] = results;

              countSubType(item.subtype)
                .then(
                  count => {
                    try {
                      item.children = count;

                      if ( ! item.type.harmony.length ) {
                        return ok(item);
                      }

                      getHarmony(item)
                        .then(
                          harmony => {
                            item.harmony = harmony;
                            ok(item);
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
