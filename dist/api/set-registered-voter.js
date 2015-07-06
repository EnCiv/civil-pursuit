'use strict';

!(function () {

  'use strict';

  var User = require('../models/user');

  /**
   *  @function setRegisteredVoter
   *  @arg {ObjectID} user_id - The User ID
   *  @arg {Boolean} is_registered_voter
   */

  function setRegisteredVoter(user_id, is_registered_voter) {

    var socket = this;

    var domain = require('domain').create();

    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });

    domain.run(function () {
      User.setRegisteredVoter(user_id, is_registered_voter, domain.intercept(function () {
        socket.emit('registered voter set', user_id);
      }));
    });
  }

  module.exports = setRegisteredVoter;
})();