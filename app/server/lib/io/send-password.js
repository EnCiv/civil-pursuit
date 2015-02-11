! function () {

  'use strict';

  var config = require('../../../business/config.json');
  var User = require('../../../business/models/User');

  function sendEmail (email, activation_key, activation_url, cb) {
    var socket = this;

    socket.domain.run(function () {
      console.log('hellllo')

      var nodemailer = require("nodemailer");

      var transporter = nodemailer.createTransport({
        service: "Zoho",
        auth: {
          user: config.email.user,
          pass: config.email.password
        }
      });

      transporter.sendMail(
        {
          from:       config.email.user,
          to:         email,
          subject:    'Reset your password',
          text:       config['forgot password email']
                        .replace(/\{key\}/g, activation_key)
                        .replace(/\{url\}/g, 'http://' + socket.handshake.headers.host + '/page/reset-password?token=' + activation_url)
        },

        socket.domain.bind(function onMailSent (error, response) {

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

  function sendPassword (email) {
    var socket = this;

    socket.pronto.emit('message', {
      'forgot password': email
    });

    socket.domain.run(function () {

      var activation_key = require('crypto').randomBytes(5).toString('hex');

      var activation_url = require('crypto').randomBytes(5).toString('hex');

      User.update({ email: email }, { activation_key: activation_key, activation_url: activation_url },
        socket.domain.intercept(function (number) {

          console.log('number', number);
          
          if ( ! number ) {

            socket.pronto.emit('message', {
              'forgot password': {
                'no such email': email
              }
            });

            return socket.emit('no such email', email);
          }

          sendEmail.apply(socket, [email, activation_key, activation_url, socket.domain.intercept(function (stat) {
            console.log('email ok', stat);
          })]);


        }));
    });
  }

  module.exports = function (socket) {
    socket.on('send password', sendPassword.bind(socket));
  };

} ();
