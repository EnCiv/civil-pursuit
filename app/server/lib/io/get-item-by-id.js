! function () {

  'use strict';

  function getItemById (socket, pronto, monson) {
    socket.on('get item by id', function (id, cb) {
      
      var url = 'models/Item.findById/' + id;

      monson.get(url)

        .on('error', function (error) {
          if ( typeof cb === 'function' ) {
            cb(error);
          }
          throw error;
        })

        .on('success', function (item) {
          socket.emit('got item by id', item);

          if ( typeof cb === 'function' ) {
            cb(null, item);
          }
        });
      
    });
  }

  module.exports = getItemById;

} ();
