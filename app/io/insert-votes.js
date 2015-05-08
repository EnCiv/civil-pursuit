! function () {

  'use strict';

  

  function insertVotes (event, votes) {

    var socket = this;

    require('syn/lib/domain')(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        require('syn/models/Vote')
          .create(votes, domain.intercept(function (votes) {
            socket.ok(event, votes);  
          }));
      }

    );
  }

  module.exports = insertVotes;

} ();
