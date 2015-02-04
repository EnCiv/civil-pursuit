! function () {

  'use strict';

  function changeUserName (socket, pronto, monson, domain) {
    
    socket.on('change user name', function (user, name) {
      
      var User = require('../../../business/models/User');

      User.update({ _id: user }, name, domain.intercept(function (user) {
        socket.emit('changed user name', user);
      }));
      
    });
  
  }

  module.exports = changeUserName;

} ();
