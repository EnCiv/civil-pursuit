! function () {

  'use strict';

  function createItem (socket, pronto, monson, domain) {
    
    socket.on('create item', function (item) {
      
      var url = 'models/Item';

      monson.post(url, item)

        .on('error', domain.intercept(function () {}))

        .on('success', function (item) {
          pronto.emit('message', 'socket created item from monson');
          socket.emit('created item', item);
        });
      
    });
  
  }

  module.exports = createItem;

} ();
