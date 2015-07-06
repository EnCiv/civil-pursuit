! function () {

  'use strict';

  

  var User = require('../models/user');

  /**
   *  @function removeRace
   *  @arg {ObjectID} user_id - The User ID
   *  @arg {ObjectID} rcae_id - The Config.Race ID
   */

  function removeRace (user_id, race_id) {

    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      User.removeRace(user_id, race_id, domain.intercept(function (item) {
        socket.emit('race removed', item);
      }));
    });

  }

  module.exports = removeRace;

} ();
