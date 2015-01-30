! function () {

  'use strict';

  function getItemDetails (socket, pronto, monson, domain) {
    socket.on('get item details', function (item, cb) {
      
      var url = 'models/Item.details/' + item;

      monson.get(url)

        .on('error', domain.intercept(function () {}))

        .on('success', function (details) {
          socket.emit('got item details', details);

          if ( typeof cb === 'function' ) {
            cb(null, details);
          }
        });

    });
  }

  module.exports = getItemDetails;

} ();
