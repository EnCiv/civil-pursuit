! function () {

  'use strict';

  

  function insertVotes (event, votes) {

    var Vote = require('syn/models/Vote');

    var socket = this;

    var domainRun = require('syn/lib/util/domain-run');

    domainRun(

      function (domain) {

        if ( ! socket.synuser ) {
          throw new Error('Must be logged in');
        }

        votes = votes.map(function (vote) {
          vote.user = socket.synuser.id;

          return vote;
        });

        console.log('creating votes', votes)

        Vote
          .create(votes, domain.intercept(function (votes) {
            console.log('got votes')
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
