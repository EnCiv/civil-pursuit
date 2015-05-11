! function () {

  'use strict';

  

  function insertFeedback (event, feedback) {

    var socket = this;

    var domainRun = require('syn/lib/util/domain-run');

    domainRun(

      function (domain) {
        require('syn/models/Feedback')
          .create(feedback, domain.intercept(function (inserted) {
            socket.ok(event, inserted);  
          }));
      },

      function (error) {
        socket.app.arte.emit('error', error);
      }

    );
  }

  module.exports = insertFeedback;

} ();
