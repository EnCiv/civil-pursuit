! function () {
  
  'use strict';

  function getLineage (cb) {

    var self        =     this;
    var Item        =     this.constructor;
    var Domain      =     require('domain').Domain;
    var d           =     new Domain().on('error', cb);
    /** @type   [ObjectID] */
    var lineage     =     [];

    process.nextTick(function () {

      if ( ! self.parent ) {
        return cb(null, lineage);
      }

      /** Get ancestors one by one */

      ! function getItem (item_id) {

        Item
          .findById(item_id)
          // .lean()
          .exec(d.intercept(function onItemFound (item) {

          if ( ! item ) {
            return cb(null, lineage);
          }

          lineage.push(item);
          
          if ( item.parent ) {
            getItem(item.parent);
          }

          else {

            lineage.reverse();

            cb(null, lineage);

          }

        }));

      } (self.parent);

    });

  }

  module.exports = getLineage;

} ();
