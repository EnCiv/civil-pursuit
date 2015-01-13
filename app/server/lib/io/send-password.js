! function () {

  'use strict';

  var config = require('../../../business/config.json');
 
  function sendPassword (socket, pronto, monson, domain, transporter) {
    socket.on('send password', function (email, cb) {

      transporter.sendMail({
        from: config.email.user,
        to: email,
        subject: 'Reset your password',
        text: 'You have one new email'
      }, domain.bind(function (error, response) {

        if ( error ) {
          socket.emit('error', error);

          if ( typeof cb === 'function' ) {
            cb(error);
          }
        }

        else {
          socket.emit('sent password', response);

          if ( typeof cb === 'function' ) {
            cb(null, response);
          }
        }

      }));
      
    });
  }

  module.exports = sendPassword;

} ();
