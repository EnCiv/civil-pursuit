! function () {

  'use strict';

  

  var User = require('../models/user');

  /**
   *  @function addRace
   *  @arg {ObjectID} user_id - The User ID
   *  @arg {ObjectID} rcae_id - The Config.Race ID
   */

  function addRace (user_id, race_id) {

    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      User.addRace(user_id, race_id, domain.intercept(function (item) {
        socket.emit('race added', item);
      }));
    });

  }

  module.exports = addRace;

} ();
