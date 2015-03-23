! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function editAndGoAgain (item_id) {

    var socket = this;

    src.domain(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {

        src('models/Item')
          .editAndGoAgain(item_id, domain.intercept(function (item) {
            socket.emit('edited item', item);
          }));

      }

    );
  
  }

  module.exports = editAndGoAgain;

} ();
