'use strict';

!(function () {

  'use strict';

  var User = require('../models/user');

  /**
   *  @function setParty
   *  @arg {ObjectID} user_id - The User ID
   *  @arg {ObjectID} party_id - Config.party ID
   */

  function setParty(user_id, party_id) {

    var socket = this;

    var domain = require('domain').create();

    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });

    domain.run(function () {
      User.setParty(user_id, party_id, domain.intercept(function () {
        socket.emit('party set', user_id);
      }));
    });
  }

  module.exports = setParty;
})();