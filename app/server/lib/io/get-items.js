! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function getItems (panel) {

    var socket = this;

    src.domain(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {

        socket.app.arte.emit('message', { socket: { 'get items': panel } });

        var id = 'panel-' + panel.type;
        var query = { type: panel.type };

        if ( panel.parent ) {
          id += '-' + panel.parent;
          query.parent = panel.parent;
        }

        src('models/Item')
          .find(query)
          .skip(panel.skip)
          .limit(panel.size)
          .sort({ "promotions": -1, "views": -1, "created": 1 })
          .lean()
          .exec(domain.intercept(function (items) {
            socket.emit('got items ' + id, panel, items);
          }));

      }

    );

  }

  module.exports = getItems;

} ();
