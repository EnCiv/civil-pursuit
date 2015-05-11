! function () {

  'use strict';

  

  function editAndGoAgain (item_id) {

    var socket = this;

    require('syn/lib/domain')(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {

        require('syn/models/Item')
          .editAndGoAgain(item_id, domain.intercept(function (item) {
            socket.emit('edited item', item);
          }));

      }

    );
  
  }

  module.exports = editAndGoAgain;

} ();
