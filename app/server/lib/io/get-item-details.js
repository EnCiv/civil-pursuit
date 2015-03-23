! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function getItemDetails (id) {

    var socket = this;

    src.domain(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        src('models/Item')
          .details(id, domain.intercept(function (details) {
            socket.emit('got item details', details);  
          }));
      }

    );
    
  }

  module.exports = getItemDetails;

} ();
