! function () {

  'use strict';

  function getItems (socket, pronto, monson, domain) {
    
    socket.on('get items', function (panel, cb) {
      
      if ( ! panel || typeof panel !== 'object' ) {
        domain.run(function () {
          throw new Error('Missing panel');
        });
      }

      var id = 'panel-' + panel.type;

      if ( panel.parent ) {
        id += '-' + panel.parent;
      }

      var url = 'models/Item?type=' + panel.type;

      if ( panel.parent ) {
        url += '&parent=' + panel.parent;
      }

      url += '&' + panel.size +
        '&$skip=' + panel.skip +
        '&sort:promotions-,views-,created+';

      /** Send request to monson */

      monson.get(url)

        .on('error', domain.intercept(function () {}))
      
        .on('success', function (items) {
          pronto.emit('message', 'socket got items from monson');
          socket.emit('got items ' + id, panel, items);
        });

    });

  }

  module.exports = getItems;

} ();
