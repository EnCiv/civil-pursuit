! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function signIn (credentials) {

    var socket = this;

    src.domain(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        src('models/User')
          .identify(credentials.email, credentials.password,
            domain.intercept(function (user) {
              
              if ( user ) {
                socket.emit('identified', user);
              }

            }));
      }

    );

  }

  module.exports = signIn;

} ();
