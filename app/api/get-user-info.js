! function () {

  'use strict';

  

  var User = require('../models/user');

  /**
   *  @arg {ObjectID} user_id - User ID
   */

  function getUserInfo (user_id) {
    var socket = this;

    require('../lib/domain')(
      function (error) {
        socket.emit('error', error);
      },

      function (domain) {
        User
          .findById(user_id)
          .lean()
          .exec(domain.intercept(function (user) {
            delete user.password;
            socket.emit('got user info', user);
          }));
      });
  }

  /**
   *  Export as a socket event listener
   */

  module.exports = getUserInfo;

} ();
