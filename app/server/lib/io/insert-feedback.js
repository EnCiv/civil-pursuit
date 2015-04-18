! function () {

  'use strict';

  

  function insertFeedback (feedback) {

    var socket = this;

    require('syn/lib/domain')(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        require('syn/models/Feedback')
          .create(feedback, domain.intercept(function (inserted) {
            socket.emit('inserted feedback', inserted);  
          }));
      }

    );
  }

  module.exports = insertFeedback;

} ();
