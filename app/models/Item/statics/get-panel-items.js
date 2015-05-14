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

  function getPanelItems (panel, cb) {
    
    var self = this;

    var promise = new Promise(function (fulfill, reject) {
      di(reject, deps, function (domain, mongoose, async, config, Item) {

        console.log('GET PANEL ITEMS', panel)

        var query = {};

        for ( var i in panel ) {
          if ( i !== 'skip' ) {
            query[i] = panel[i];
          }
        }

        if ( ! panel.item ) {
          Item
            .find(query)
            .skip(panel.skip || 0)
            .limit(panel.size || config.public['navigator batch size'])
            .sort({ promotions: -1 })
            .exec(domain.intercept(function (items) {
              console.log('got items', items.length)
              async.map(items,

                function (item, cb) {
                  item.toPanelItem(cb);
                },

                domain.intercept(function (items) {
                  fulfill(items);
                }));

            }));
        }

      });
    });

    if ( typeof cb === 'function' ) {
      promise.then(cb.bind(null, null), cb);
    }

    return promise;

  }

  module.exports = getPanelItems;

} ();
