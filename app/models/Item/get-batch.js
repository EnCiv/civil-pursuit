! function () {
  
  'use strict';

  

  function getBatch (item_id, cb) {
    var self = this;

    var Item = require('mongoose').model('Item');

    require('syn/lib/domain/next-tick')(cb, function (domain) {

      require('syn/models/Item')

        .findById(item_id)

        .exec(domain.intercept(function (item) {

          require('async').parallel({
            lineage: function getLineage (cb) {

              item.getLineage(cb);

            },

            entourage: function getEntourage (cb) {
              
              item.getEntourage(cb);

            },

            countRelated: function countRelated (cb) {

              item.countRelated(cb);

            }},

            domain.intercept(function (results) {

              cb(null, {
                item        :   item,
                entourage   :   results.entourage,
                lineage     :   results.lineage,
                related     :   results.countRelated
              });
            }));

        }));

    });

  }

  module.exports = getBatch;

} ();
