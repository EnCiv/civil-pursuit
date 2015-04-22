! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/util/random-string',
    'syn/models/Item'
  ];

  function generateShortId (cb) {

    di(cb, deps, function (domain, randomString, Item) {

      randomString(5, domain.intercept(function (id) {
        
        Item
          .findOne({ id: id })
          .lean()
          .exec(domain.intercept(function (item) {
            if ( ! item ) {
              cb(null, id);
            }
            else {
              generateShortId(cb);
            }
          }))

      }));

    }, cb);

  }

  module.exports = generateShortId;

} ();
