! function () {

  'use strict';

  

  var User = require('../models/user');

  /**
   *  @function setBirthdate
   *  @arg {ObjectID} user_id - The User ID
   *  @arg {Date} birthdate
   */

  function setBirthdate (user_id, birthdate) {

    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      User.setBirthdate(user_id, birthdate, domain.intercept(function () {
        socket.emit('birthdate set', user_id);
      }));
    });

  }

  module.exports = setBirthdate;

} ();
