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
            getItem(item.parent);
          }

          else {

            lineage.reverse();

            countRelated(lineage);

          }

        }));

      } (self.parent);

      function countRelated (lineage) {
        require('async').map(lineage,
          function onEachItem (item, cb) {
            item.countRelated(domain.intercept(function (count) {
              cb(null, item.toObject({ transform: function (doc, ret, options) {
                ret.related = count;
                ret.getPromotionPercentage = doc.getPromotionPercentage;
                  // ret.countRelated = doc.countRelated;
              }}));
            }))
          },
          cb);
      }

    });

  }

  module.exports = getLineage;

} ();
