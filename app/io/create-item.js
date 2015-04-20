! function () {

  'use strict';

  

  function createItem (item) {

    var socket = this;

    require('syn/lib/domain')(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        require('syn/models/Item')
          .create(item, domain.intercept(function (item) {
            socket.emit('created item', item);  
          }));
      }

    );
  
  }

  module.exports = createItem;

} ();
