! function () {

  'use strict';

  

  function getItemById (id) {

    var socket = this;

    require('syn/lib/domain')(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        require('syn/models/Item')
          .findById(id)
          .lean()
          .exec(domain.intercept(function (item) {
            socket.emit('got item by id', item);  
          }));
      }

    );
  }

  module.exports = getItemById;

} ();
