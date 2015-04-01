! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function getLineage (cb) {

    var self = this;

    var Item = require('mongoose').model('Item');
    
    src.domain.nextTick(cb, function getLineageDomain (domain) {

      /** @type   [ObjectID] */

      var lineage = [];

      if ( ! self.parent ) {
        return cb(null, lineage);
      }

      /** Get ancestors one by one */

      ! function getItem (item_id) {

        Item
          .findById(item_id)
          // .lean()
          .exec(domain.intercept(function onItemFound (item) {

          if ( ! item ) {
            return cb(null, lineage);
          }

          lineage.push(item);
          
          if ( item.parent ) {
            getItem(parent);
          }

          else {
            // lineage.shift();
            lineage.reverse();
            cb(null, lineage);
          }

        }));

      } (self.parent);

    });

  }

  module.exports = getLineage;

} ();
