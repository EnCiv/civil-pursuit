'use strict';

import async              from 'async';
import config             from 'syn/config.json';
import toSlug             from 'syn/lib/util/to-slug';
import calcHarmony        from 'syn/lib/get-harmony';
import TypeModel          from 'syn/models/type';
import UserModel          from 'syn/models/user';

function toPanelItem () {

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
  item.popularity   =   item.getPopularity();
  item.link         =   '/item/' + this.id + '/' + toSlug(this.subject);

  let getType = () => new Promise((ok, ko) => {
    TypeModel
      .findById(this.type)
      .populate('harmony')
      .exec()
      .then(ok, ko);
  });

  let getUser = () => new Promise((ok, ko) => {
    UserModel
      .findById(this.user)
      .exec()
      .then(
        user => {
          if ( ! user ) {
            throw new Error('User not found: ' + this.user);
          }
          let { gps, _id } = user;
          ok({ 'full name' : user.fullName, gps, _id });
        },
        ko
      );
  });

  let getSubtype = () => new Promise((ok, ko) => {
    TypeModel
      .findOne({ parent : this.type })
      .exec()
      .then(ok, ko);
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

  let getHarmony = () => new Promise((ok, ko) => {

    let { harmony } = this.type;

    let promises = harmony.map(side => {
      new Promise((ok, ko) => {
        ItemModel
          .where({
            parent    :   this._id,
            type      :   side._id
          })
          .count((error, count) => {
            if ( error ) {
              return ko(error);
            }
            ok(count);
          })
      })
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
      countChildren()
    ])
    .then(
      results => {
        [ this.lineage, this.type, this.user, this.subtype, this.children ] = results;

        if ( ! this.type.harmony.length ) {
          return ok(this);
        }

        getHarmony()
          .then(
            harmony => {
              this.harmony = harmony;
              ok(this);
            },
            ko
          )
      }
    );
}

export default toPanelItem;
