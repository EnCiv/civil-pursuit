! function () {

  'use strict';

  var Item = require('../../../business/models/Item');

  /**
   *  @arg {String} item - Item ObjectID String (_id)
   *  @arg {Function} cb
   */

  function getEvaluation (item, cb) {
    var socket = this;

    socket.domain.run(function () {
      Item.evaluate(item, socket.domain.intercept(function (evaluation) {
        socket.emit('got evaluation', evaluation);
      }));
    });
  }

  /**
   *  Export as a socket event listener
   */

  module.exports = function (socket) {
    socket.on('get evaluation', getEvaluation.bind(socket));
  };

} ();
