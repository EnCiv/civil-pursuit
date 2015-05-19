! function () {

  'use strict';

  function getEvaluation (event, item_id) {
    var socket = this;

    var domainRun = require('syn/lib/util/domain-run');

    domainRun(

      function (domain) {
        require('syn/models/Item')
          .evaluate(socket.synuser.id, item_id, domain.intercept(function (evaluation) {
            socket.ok(event, evaluation);
          }));
      },

      function (error) {
        socket.app.arte.emit('error', error);
      }

    );
  }

  module.exports = getEvaluation;

} ();
