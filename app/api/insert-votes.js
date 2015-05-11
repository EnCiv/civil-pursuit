! function () {

  'use strict';

  

  function insertVotes (event, votes) {

    var socket = this;

    var domainRun = require('syn/lib/util/domain-run');

    domainRun(

      function (domain) {
        require('syn/models/Vote')
          .create(votes, domain.intercept(function (votes) {
            socket.ok(event, votes);  
          }));
      },

      function (error) {
        socket.app.arte.emit('error', error);
      }

    );
  }

  module.exports = insertVotes;

} ();
