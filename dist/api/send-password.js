'use strict';

!(function () {

  'use strict';

  var config = require('syn/config');

  var User = require('syn/models/user');

  var sendEmail = require('syn/lib/util/send-email');

  /**
   *  @function sendPassword
   *  @arg {string} email
   *  @this {Socket}
   */

  function sendPassword(email) {
    var socket = this;

    process.nextTick(function () {

      socket.pronto.emit('message', {
        'forgot password': email
      });

      socket.domain.run(function () {

        if (typeof email !== 'string') {
          throw new Error('Email should be a string');
        }

        User.makePasswordResettable(email, socket.domain.bind(function (error, keys) {

          if (error && error.code === 'DOCUMENT_NOT_FOUND') {
            socket.pronto.emit('message', {
              'forgot password': {
                'no such email': email
              }
            });

            return socket.emit('no such email', email);
          }

          if (error) {
            throw error;
          }

          socket.emit('password is resettable', email);

          var $email = {
            from: config.email.user,
            to: email,
            subject: 'Reset password',
            text: config['forgot password email'].replace(/\{key\}/g, keys.key).replace(/\{url\}/g, 'http://' + socket.handshake.headers.host + '/page/reset-password?token=' + keys.token)
          };

          function intercept(stats) {
            socket.pronto.emit('message', {
              'forgot password': {
                'reset email sent': email
              }
            });

            socket.emit('sent password reset email', email);
          }

          sendEmail.apply(socket, [$email, socket.domain.intercept(intercept)]);
        }));
      });
    });
  }

  module.exports = sendPassword;
})();