! function () {

  'use strict';

  

  function getItemDetails (event, id) {

    var socket = this;

    require('syn/lib/domain')(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        require('syn/models/Item')
          .getDetails(id, domain.intercept(function (details) {
            socket.ok(event, details);  
          }));
      }

    );
    
  }

  module.exports = getItemDetails;

} ();
