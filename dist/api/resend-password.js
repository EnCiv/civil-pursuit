'use strict';

!(function () {

  'use strict';

  // var config = require('../../config.json');

  function resendPassword(socket, pronto, monson, domain, smtp) {
    socket.on('resend password', function (email, cb) {

      smtp.sendMail({
        from: config.email.user,
        to: email,
        subject: 'Reset your password',
        text: 'You have one new email'
      });
    });
  }

  module.exports = resendPassword;
})();