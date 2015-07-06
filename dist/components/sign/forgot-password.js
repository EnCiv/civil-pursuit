'use strict';

!(function () {

  'use strict';

  var Form = require('../../lib/util/form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function forgotPassword() {

    var signComponent = this;

    this.form = $('#forgot-password form');

    // On close modal, reset form

    $('#forgot-password .close').on('click', function () {

      signComponent.form.find('[name="email"]').val('').removeClass('error');

      if ($('.forgot-password-email-not-found.in').length) {
        $('.forgot-password-email-not-found').collapse('hide');
      }

      if ($('.forgot-password-pending.in').length) {
        $('.forgot-password-pending').collapse('hide');
      }

      if ($('.forgot-password-ok.in').length) {
        $('.forgot-password-ok').collapse('hide');
      }
    });

    $('#forgot-password form[name="forgot-password"]').on('submit', function () {

      // If previous operation still in course, abort

      if ($('.forgot-password-pending.in').length) {
        return false;
      }

      // If previous operation OK, abort

      if ($('.forgot-password-ok.in').length) {
        return false;
      }

      var email = $(this).find('[name="email"]');

      email.removeClass('error');

      if ($('.forgot-password-email-not-found.in').length) {
        $('.forgot-password-email-not-found').collapse('hide');
      }

      if (!email.val()) {
        email.addClass('error').focus();
      } else {

        $('.forgot-password-pending').collapse('show');

        setTimeout(function () {
          app.socket.once('no such email', function (_email) {
            if (_email === email.val()) {

              $('.forgot-password-pending').css('display', 'none');

              $('.forgot-password-pending').collapse('hide');

              setTimeout(function () {
                $('.forgot-password-pending').css('display', 'block');
              });

              $('.forgot-password-email-not-found').collapse('show');
            }
          });

          app.socket.on('password is resettable', function (_email) {
            if (_email === email.val()) {
              $('.forgot-password-pending').collapse('hide');

              $('.forgot-password-ok').collapse('show');

              $('.form-section.collapse').collapse('hide');

              setTimeout(function () {
                $('#forgot-password').modal('hide');
              }, 2500);
            }
          });

          app.socket.emit('send password', email.val());
        }, 750);
      }

      return false;
    });
  }

  module.exports = forgotPassword;
})();