! function () {

  'use strict';

  function getItems (socket, pronto, monson) {
    
    socket.on('get items', function (panel, cb) {
      
      if ( ! panel || typeof panel !== 'object' ) {
        throw new Error('Missing panel');
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
        .on('error', function (error) {
          throw error;
        })
        .on('success', function (items) {
          pronto.emit('message', 'socket got items from monson');
          socket.emit('got items', {
            panel: panel,
            items: items
          });
        });

    });

  }

  module.exports = getItems;

} ();
