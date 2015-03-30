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

        self.findById(item_id, domain.intercept(function onItemFound (item) {

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

      } ();

    });

  }

  module.exports = getLineage;

} ();
