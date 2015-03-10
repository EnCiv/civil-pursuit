! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function changeUserName (user_id, name) {

    var socket = this;

    src.domain.nextTick(

      function (error) {

        socket.pronto.emit('error', error);
      
      },

      function (domain) {

        src('models/User').update({ _id: user_id }, name,
          domain.intercept(function (user) {
            socket.emit('user name changed', user);  
          }));

      }

    );
  
  }

  module.exports = changeUserName;

} ();
