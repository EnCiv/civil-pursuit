! function () {

  'use strict';

  

  var User = require('../models/user');

  /**
   *  @function setEmployment
   *  @arg {ObjectID} user_id - The User ID
   *  @arg {ObjectID} employment_id - The Config.Married ID
   */

  function setEmployment (user_id, employment_id) {

    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      User.setEmployment(user_id, employment_id, domain.intercept(function (user) {
        socket.emit('employment set', user);
      }));
    });

  }

  module.exports = setEmployment;

} ();
