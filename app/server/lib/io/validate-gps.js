! function () {

  'use strict';

  var User = require('../../../business/models/User');

  /**
   *  @arg {String} item - Item ObjectID String (_id)
   *  @arg {Function
   */

  function validateGPS (user_id, lng, lat) {
    var socket = this;

    socket.domain.run(function () {
      User.update({ _id: user_id },
        {
          'gps': [lng, lat],
          'gps validated': Date.now()
        },

        socket.domain.intercept(function () {
          socket.emit('validated gps');
        }));
    });
  }

  /**
   *  Export as a socket event listener
   */

  module.exports = function (socket) {
    socket.on('validate gps', validateGPS.bind(socket));
  };

} ();
