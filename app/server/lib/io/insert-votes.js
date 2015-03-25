! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function insertVotes (votes) {

    var socket = this;

    src.domain(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        src('models/Vote')
          .create(votes, domain.intercept(function (votes) {
            socket.emit('inserted votes', votes);  
          }));
      }

    );
  }

  module.exports = insertVotes;

} ();
