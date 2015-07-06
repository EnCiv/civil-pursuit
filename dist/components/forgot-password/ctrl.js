'use strict';

!(function () {

  'use strict';

  var Form = require('../../lib/util/form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function forgotPassword($vexContent) {
    var signForm = $('form[name="forgot-password"]');

    var form = new Form(signForm);

    form.send(function () {
      var domain = require('domain').create();

      domain.on('error', function (error) {});

      domain.run(function () {

        $('.forgot-password-pending.hide').removeClass('hide');
        $('.forgot-password-email-not-found').not('.hide').addClass('hide');
        $('.forgot-password-ok').not('.hide').addClass('hide');

        app.socket.once('no such email', function (_email) {
          if (_email === form.labels.email.val()) {

            $('.forgot-password-pending').addClass('hide');

            setTimeout(function () {});

            $('.forgot-password-email-not-found').removeClass('hide');
          }
        });

        app.socket.on('password is resettable', function (_email) {
          if (_email === form.labels.email.val()) {
            $('.forgot-password-pending').addClass('hide');

            $('.forgot-password-ok').removeClass('hide');

            setTimeout(function () {
              vex.close($vexContent.data().vex.id);
            }, 2500);
          }
        });

        app.socket.emit('send password', form.labels.email.val());
      });
    });
  }

  module.exports = forgotPassword;
})();

//

// $('.forgot-password-pending').css('display', 'block');