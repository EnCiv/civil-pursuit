! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function getItems (panel, item) {

    var socket = this;

    function onDomainError (error) {
      socket.app.arte.emit('error', error);
    }

    function run (domain) {
      socket.app.arte.emit('message', {
        socket: {
          in: {
            message: 'get items',
            panel: panel,
            item: item && item._id
          }
        }
      });

      var limit = panel.size;

      var items = [];

      if ( item ) {
        limit --;
        items.push(item);
        panel.type = item.type;
      }

      else if ( panel.item ) {
        return src('models/Item')
          .findById(panel.item)
          // .lean()
          .exec(domain.intercept(function (item) {
            getItems.apply(socket, [panel, item]);
          }));
      }

      var id = 'panel-' + panel.type;
      var query = { type: panel.type };

      if ( panel.parent ) {
        id += '-' + panel.parent;
        query.parent = panel.parent;
      }

      var find = src('models/Item').find(query);

      if ( item ) {
        find
          .where  ('_id')
          .ne     (item._id)
      }

      find
        .skip   (panel.skip)
        .limit  (limit)
        .sort   ({ "promotions": -1, "views": -1, "created": 1 })
        // .lean   ()
        .exec   (domain.intercept(function (_items) {
          socket.emit('got items ' + id, panel, items.concat(_items));
          socket.app.arte.emit('message', {
            socket: {
              out: {
                message: 'got items ' + id,
                panel: panel,
                items: items.concat(_items).map(function (item) {
                  var i = {};

                  i[item._id] = '[' + item.type + '] ' + item.subject;

                  return i;
                })
              }
            }
          });
        }));
    }

    src.domain(onDomainError, run);

  }

  module.exports = getItems;

} ();
