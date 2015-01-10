! function () {

  'use strict';

  function addView (socket, pronto, monson) {
    
    socket.on('add view', function (item, cb) {
      
      var url = 'models/Item.incrementView/' + item;

      monson.get(url)

        .on('error', function (error) {
          throw error;
        })

        .on('success', function (item) {
          socket.emit('view added', item);
        });
      
    });

  }

  module.exports = addView;

} ();
