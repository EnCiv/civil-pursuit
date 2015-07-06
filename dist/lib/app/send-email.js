'use strict';

!(function () {

  'use strict';

  var config = require('../../../config');

  /**
   *
   */

  function sendEmail(options, cb) {

    var domain = require('domain').create();

    domain.on('error', function (error) {
      cb(error);
    });

    domain.run(function () {
      var nodemailer = require('nodemailer');

      var transporter = nodemailer.createTransport({
        service: 'Zoho',
        auth: {
          user: config.email.user,
          pass: config.email.password
        }
      });

      transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text
      }, domain.bind(cb));
    });
  }

  module.exports = sendEmail;
})();