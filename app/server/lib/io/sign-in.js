! function () {

  'use strict';

  function signIn (socket, pronto, monson) {
    
    socket.on('get evaluation', function (credentials, cb) {
      
      var url = 'models/User.identify/' + credentials.email +
        '/' + credentials.password;

      monson.get(url)

        .on('error', function (error) {
          if ( /^User not found/.test(error.message) ) {
            socket.emit('user not found', credentials);
          }
          else {
            throw error;
          }
        })

        .on('success', function (user) {
          pronto.emit('message', 'socket got identification from monson');
          socket.emit('identified', user);
        });
              
    });

  }

  module.exports = signIn;

} ();
