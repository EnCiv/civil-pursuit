! function () {

  'use strict';

  function insertFeedback (event, feedback) {

    var socket = this;

    var Feedback = require('syn/models/Feedback');

    var domainRun = require('syn/lib/util/domain-run');

    domainRun(

      function (domain) {

        if ( ! ('user' in feedback) ) {
          feedback.user = socket.synuser.id;
        }

        Feedback
          .create(feedback, domain.intercept(function (inserted) {
            socket.ok(event, inserted);  
          }));
      },

      function (error) {
        socket.emit('error', error);
      }

    );
  }

  module.exports = insertFeedback;

} ();
