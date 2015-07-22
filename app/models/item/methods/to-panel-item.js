'use strict';

import async              from 'async';
import config             from '../../../../config.json';
import toSlug             from '../../../lib/util/to-slug';
import calcHarmony        from '../../../lib/get-harmony';
import TypeModel          from '../../type';
import UserModel          from '../../user';
import VoteModel          from '../../vote';

function toPanelItem (cb) {
  return new Promise((ok, ko) => {
    try {

      if ( typeof cb === 'function' ) {
        return ko(new Error('Deprecated use of toPanelItem with callback' +
          '! Please use Promise syntax now'));
      }

      let ItemModel = this.constructor;

      let {
        _id,
        id,
        subject,
        description,
        image,
        references,
        views,
        promotions
      } = this;

      let item = {
        _id,
        id,
        subject,
        description,
        image,
        references,
        views,
        promotions
      };

      item.image        =   item.image || config.public['default item image'];
      item.imageHTML    =   this.getImageHtml();
      item.popularity   =   this.getPopularity();
      item.link         =   '/item/' + this.id + '/' + toSlug(this.subject);

      // let getParent     =   () => new Promise((ok, ko) => {
      //   try {
      //     if ( ! this.parent ) {
      //       return ok(null);
      //     }
      //     ItemModel
      //       .findById(this.parent)
      //       .exec()
      //       .then(ok, ko);
      //   }
      //   catch ( error ) {
      //     ko(error);
      //   }
      // });

      let getType       = () => new Promise((ok, ko) => {
        TypeModel
          .findById(this.type)
          .populate('harmony')
          .exec()
          // .then(ok, ko);
          .then(
            type => {
              ok(type);
            },
            ko
          )
      });

      let getUser       = () => new Promise((ok, ko) => {
        UserModel
          .findById(this.user)
          .exec()
          .then(
            user => {
              try {
                if ( ! user ) {
                  throw new Error('User not found: ' + this.user);
                }
                let { gps, _id } = user;
                ok({ 'full name' : user.fullName, gps, _id });
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      });

      let getSubtype    = () => new Promise((ok, ko) => {
        try {
          TypeModel
            .find({ parent : this.type })
            .exec()
            .then(
              types => {
                try {
                  if ( ! types.length ) {
                    return ok(null);
                  }
                  let promises = types.map(type => type.isHarmony());
                  Promise
                    .all(promises)
                    .then(
                      results => {
                        try {
                          let subtype = results.reduce(
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

      let countChildren = () => new Promise((ok, ko) => {
        ItemModel
          .count({ parent : this._id }, (error, count) => {
            if ( error ) {
              return ko(error);
            }
            ok(count);
          });
      });

      let countSubType = subtype => new Promise((ok, ko) => {

        let query = {
          parent    :   this._id,
          type      :   subtype
        };

        ItemModel
          .count(query, (error, count) => {
            if ( error ) {
              return ko(error);
            }
            ok(count);
          });
      });

      let countHarmony = harmony => new Promise((ok, ko) => {

        if ( ! harmony.length ) {
          return ok(0);
        }

        let query = {
          parent    :   this._id,
          type      :   {
            $in     :   harmony.map(h => h._id)
          }
        };

        ItemModel
          .count(query, (error, count) => {
            if ( error ) {
              return ko(error);
            }
            ok(count);
          });
      });

      let countVotes = () => new Promise((ok, ko) => {
        VoteModel
          .where({ item : this._id })
          .count((error, count) => {
            if ( error ) {
              return ko(error);
            }
            ok(count);
          });
      });

      let getHarmony    = (item) => new Promise((ok, ko) => {

        let { harmony } = item.type;

        let promises = harmony.map(side => {
          new Promise((ok, ko) => {
            ItemModel
              .where({
                parent    :   item._id,
                type      :   side._id
              })
              .count((error, count) => {
                if ( error ) {
                  return ko(error);
                }
                ok(count);
              })
          });
        });

        Promise
          .all(promises)
          .then(
            results => {
              let [ pro, con ] = results;
              ok(calcHarmony(pro, con));
            },
            ko
          );
      });

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
    }

    catch ( error ) {
      ko(error);
    } 

  });
}

export default toPanelItem;
