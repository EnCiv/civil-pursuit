! function () {

  'use strict';

  function getUserInfo (socket, pronto, monson, domain) {
    
    socket.on('get user info', function (user) {
      
      var url = 'models/User.findById/' + user;

      monson.get(url)

        .on('error', domain.bind(function (error) {
          socket.emit('could not get user info', error);
        }))

        .on('success', function (user) {

          delete user.password;

          socket.emit('got user info', user);
        });
      
    });
  
  }

  module.exports = getUserInfo;

} ();
