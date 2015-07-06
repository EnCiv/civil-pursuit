! function () {

  'use strict';

  

  var User = require('../models/user');

  /**
   *  @function setEducation
   *  @arg {ObjectID} user_id - The User ID
   *  @arg {ObjectID} education_id - The Config.Married ID
   */

  function setEducation (user_id, education_id) {

    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      User.setEducation(user_id, education_id, domain.intercept(function (user) {
        socket.emit('education set', user);
      }));
    });

  }

  module.exports = setEducation;

} ();
