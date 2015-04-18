! function () {

  'use strict';

  

  function getItemDetails (id) {

    var socket = this;

    require('syn/lib/domain')(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        require('syn/models/Item')
          .details(id, domain.intercept(function (details) {
            socket.emit('got item details', details);  
          }));
      }

    );
    
  }

  module.exports = getItemDetails;

} ();
