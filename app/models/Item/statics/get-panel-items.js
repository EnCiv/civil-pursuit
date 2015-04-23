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
      di(fulfill, deps, function (domain, mongoose, async, config, Item) {

        var query = { type: panel.type };

        if ( panel.parent ) {
          query.parent = panel.parent;
        }

        if ( ! panel.item ) {
          Item
            .find(panel)
            .limit(panel.size || config.public['navigator batch size'])
            .skip(panel.skip || 0)
            .sort({ promotions: -1 })
            .exec(domain.intercept(function (items) {

              async.map(items,

                function (item, cb) {
                  item.toPanelItem(cb);
                },

                domain.intercept(function (items) {
                  fulfill(items)
                }));

            }));
        }

      });
    });

    promise.then(cb.bind(null, null), cb);

    return promise;

  }

  module.exports = getPanelItems;

} ();
