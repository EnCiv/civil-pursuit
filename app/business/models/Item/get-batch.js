! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function getBatch (item_id, cb) {
    var self = this;

    var Item = require('mongoose').model('Item');

    src.domain.nextTick(cb, function (domain) {

      src('models/Item')

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
