! function () {

  'use strict';

  function addView (socket, pronto, monson, domain) {
    
    socket.on('add view', function (item, cb) {
      
      var url = 'models/Item.incrementPromotion/' + item;

      monson.get(url)

        .on('error', domain.intercept(function () {}))

        .on('success', function (item) {
          socket.emit('promoted', item);
        });
      
    });

  }

  module.exports = addView;

} ();
