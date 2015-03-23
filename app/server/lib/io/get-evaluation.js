! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function getEvaluation (item_id) {
    var socket = this;

    src.domain(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        src('models/Item')
          .evaluate(item_id, domain.intercept(function (evaluation) {
            socket.emit('got evaluation', evaluation);
          }));
      }

    );
  }

  module.exports = getEvaluation;

} ();
