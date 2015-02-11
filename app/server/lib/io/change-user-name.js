! function () {

  'use strict';

  var User = require('../../../business/models/User');

  function changeUserName (user_id) {

    var socket = this;

    socket.domain.run(function () {
      
      User.update({ _id: user_id }, name, socket.domain.intercept(function (user) {
        socket.emit('changed user name', user);
      }));
    
    });
  
  }

  module.exports = function (socket) {
    socket.on('change user name', changeUserName.bind(socket));
  };

} ();
