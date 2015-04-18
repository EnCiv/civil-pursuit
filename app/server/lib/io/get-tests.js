! function () {

  'use strict';

  

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

      console.log('<<"get items"', panel, item);

      require('syn/models/Item')
        .find   (query)
        .skip   (panel.skip)
        .limit  (panel.size)
        .sort   ({ "promotions": -1, "views": -1, "created": 1 })
        .exec   (domain.intercept(function (items) {

          console.log()
          console.log('- got items -', panel.type, items.length);
          console.log()

          require('async').map(items,

            function onEachItem (item, cb) {
              item.countRelated(cb);
            },

            domain.intercept(function (related) {
              var _items = items.map(function (item, index) {
                return item.toObject({ transform: function (doc, ret, options) {
                  ret.related = related[index];
                  ret.getPromotionPercentage = item.getPromotionPercentage();
                  ret.adjustImage = item.adjustImage();
                  ret.foo = true;
                }});
              });

              socket.emit('got items ' + id, panel, _items);

              console.log('>>"got items ' + id + '"', panel, _items.map(function (item) {
                return item;
              }));
            }));

        }));
    }

    require('syn/lib/domain')(onDomainError, run);

  }

  module.exports = getItems;

} ();
