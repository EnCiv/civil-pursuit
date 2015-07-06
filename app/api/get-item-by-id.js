! function () {

  'use strict';

  

  function getItemById (id) {

    var socket = this;

    require('../lib/domain')(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        require('../models/item')
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
