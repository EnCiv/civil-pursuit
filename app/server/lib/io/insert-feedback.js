! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function insertFeedback (feedback) {

    var socket = this;

    src.domain(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        src('models/Feedback')
          .insert(feedback, domain.intercept(function (inserted) {
            socket.emit('inserted feedback', inserted);  
          }));
      }

    );
  }

  module.exports = insertFeedback;

} ();
