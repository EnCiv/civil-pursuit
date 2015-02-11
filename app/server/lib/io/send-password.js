! function () {

  'use strict';

  var config = require('../../../business/config.json');
  var User = require('../../../business/models/User');

  function sendEmail (email, activation_key, activation_url, cb) {
    var socket = this;

    socket.domain.run(function () {
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

        socket.domain.bind(cb));

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

          if ( ! number ) {

            socket.pronto.emit('message', {
              'forgot password': {
                'no such email': email
              }
            });

            return socket.emit('no such email', email);
          }

          sendEmail.apply(socket, [email, activation_key, activation_url, socket.domain.intercept(function (stat) {
            socket.pronto.emit('message', {
              'forgot password': {
                'reset email sent': email
              }
            });
            socket.emit('sent password', email);
          })]);


        }));
    });
  }

  module.exports = function (socket) {
    socket.on('send password', sendPassword.bind(socket));
  };

} ();
