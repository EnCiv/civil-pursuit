! function () {

  'use strict';

  function getItemDetails (socket, pronto, monson) {
    socket.on('get item details', function (item, cb) {
      
      var url = 'models/Item.details/' + item._id;

      monson.get(url)

        .on('error', function (error) {
          throw error;
        })

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
