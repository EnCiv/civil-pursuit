! function () {

  'use strict';

  function addView (socket, pronto, monson) {
    
    socket.on('add view', function (item, cb) {
      
      var url = 'models/Item.incrementPromotion/' + item;

      monson.get(url)

        .on('error', function (error) {
          throw error;
        })

        .on('success', function (item) {
          socket.emit('promoted', item);
        });
      
    });

  }

  module.exports = addView;

} ();
