! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function getLineage (item_id, cb) {

    var self = this;
    
    src.domain.nextTick(cb, function getLineageDomain (domain) {

      /** @type   [ObjectID] */

      var lineage = [];

      /** Get ancestors one by one */

      ! function getItem (item_id) {

        self
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

      } (item_id);

    });

  }

  module.exports = getLineage;

} ();
