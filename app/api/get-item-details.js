! function () {

  'use strict';

  function getItemDetails (event, id) {

    var socket = this;

    var domainRun = require('syn/lib/util/domain-run');

    domainRun(

      function (domain) {
        require('syn/models/Item')
          .getDetails(id, domain.intercept(function (details) {
            socket.ok(event, details);  
          }));
      },

      function (error) {
        socket.app.arte.emit('error', error);
      }

    );
    
  }

  module.exports = getItemDetails;

} ();
