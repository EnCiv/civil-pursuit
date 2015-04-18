! function () {

  'use strict';

  

  function changeUserName (user_id, name) {

    var socket = this;

    require('syn/lib/domain/next-tick')(

      function (error) {

        socket.pronto.emit('error', error);
      
      },

      function (domain) {

        require('syn/models/User').update({ _id: user_id }, name,
          domain.intercept(function (user) {
            socket.emit('user name changed', user);  
          }));

      }

    );
  
  }

  module.exports = changeUserName;

} ();
