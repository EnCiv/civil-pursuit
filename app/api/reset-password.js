! function () {
  
  'use strict';

  

  var User        =   require('syn/models/user');

  function resetPassword (key, token, password) {
    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.emit('reset password ko', {
        message: error.message,
        name: error.name,
        code: error.code,
        stack: error.stack.split(/\n/)
      });
    });

    process.nextTick(function () {
      domain.run(function () {

        User.resetPassword(key, token, password,
          domain.intercept(function () {
            
            socket.emit('reset password ok');

          }));

      });
    });
  }

  module.exports = resetPassword;

} ();
