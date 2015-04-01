! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function getItems (panel, item) {

    var socket = this;

    function onDomainError (error) {
      socket.app.arte.emit('error', error);
    }

    function run (domain) {

      var id = 'panel-' + panel.type;
      var query = { type: panel.type };

      if ( panel.parent ) {
        id += '-' + panel.parent;
        query.parent = panel.parent;
      }

      src('models/Item')
        .find   (query)
        .skip   (panel.skip)
        .limit  (panel.size)
        .sort   ({ "promotions": -1, "views": -1, "created": 1 })
        .exec   (domain.intercept(function (items) {

          require('async').map(items,

            function onEachItem (item, cb) {
              item.countRelated(cb);
            },

            domain.intercept(function (related) {
              var _items = items.map(function (item, index) {
                return item.toObject({ transform: function (doc, ret, options) {
                  ret.related = related[index];
                  ret.getPromotionPercentage = doc.getPromotionPercentage;
                }});
              });

              socket.emit('got items ' + id, panel, _items);
            }));

        }));
    }

    src.domain(onDomainError, run);

  }

  module.exports = getItems;

} ();
