! function () {

  'use strict';

  

  var User = require('syn/models/user');

  /**
   *  @function setMaritalStatus
   *  @arg {ObjectID} user_id - The User ID
   *  @arg {ObjectID} status_id - The Config.Married ID
   */

  function setMaritalStatus (user_id, status_id) {

    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      User.setMaritalStatus(user_id, status_id, domain.intercept(function (user) {
        socket.emit('marital status set', user);
      }));
    });

  }

  module.exports = setMaritalStatus;

} ();
