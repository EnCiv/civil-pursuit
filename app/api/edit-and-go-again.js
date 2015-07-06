! function () {

  'use strict';

  

  function editAndGoAgain (item_id) {

    var socket = this;

    var domainRun = require('../lib/util/domain-run');

    domainRun(

      function (domain) {

        require('../models/item')
          .editAndGoAgain(item_id, domain.intercept(function (item) {
            socket.emit('edited item', item);
          }));

      },

      function (error) {
        socket.app.arte.emit('error', error);
      }

    );
  
  }

  module.exports = editAndGoAgain;

} ();
