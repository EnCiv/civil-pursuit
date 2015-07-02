! function () {

  'use strict';

  

  var User = require('syn/models/user');

  /**
   *  @function setGender
   *  @arg {ObjectID} user_id - The User ID
   *  @arg {String} gender - M for male, F for female
   */

  function setGender (user_id, gender) {

    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      User.setGender(user_id, gender, domain.intercept(function () {
        socket.emit('gender set', user_id);
      }));
    });

  }

  module.exports = setGender;

} ();
