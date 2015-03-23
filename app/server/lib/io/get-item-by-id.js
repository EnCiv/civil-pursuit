! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function getItemById (id) {

    var socket = this;

    src.domain(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        src('models/Item')
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
