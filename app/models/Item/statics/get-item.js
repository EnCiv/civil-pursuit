! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var Promise = require('promise');

  var deps = [
    'mongoose',
    'async',
    'syn/config',
    'syn/models/Item'
  ]

  function getItem (item_short_id, cb) {
    
    var self = this;

    var promise = new Promise(function (fulfill, reject) {
      di(fulfill, deps, function (domain, mongoose, async, config, Item) {
        Item
          .findOne({ "id": item_short_id })
          .exec(domain.intercept(function (item) {

            item.toPanelItem((error, item) => {
              if ( error ) {
                return reject(error);
              }
              fulfill(item);
            });

          }));
      });
    });

    if ( typeof cb === 'function' ) {
      promise.then(cb.bind(null, null), cb);
    }

    return promise;

  }

  module.exports = getItem;

} ();
