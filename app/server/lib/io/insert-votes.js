! function () {

  'use strict';

  

  function insertVotes (votes) {

    var socket = this;

    require('syn/lib/domain')(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        require('syn/models/Vote')
          .create(votes, domain.intercept(function (votes) {
            socket.emit('inserted votes', votes);  
          }));
      }

    );
  }

  module.exports = insertVotes;

} ();
