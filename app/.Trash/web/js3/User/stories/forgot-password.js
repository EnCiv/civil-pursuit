! function () {

  'use strict';

  function forgotPassword () {
    var app = this;

    var Socket = app.importer.emitter('socket');

    app.view('forgot password').find('form').on('submit', function () {

      var email = app.view('forgot password').find('[name="email"]');

      email.removeClass('error');

      if ( ! email.val() ) {
        email.addClass('error').focus();
      }

      else {
        Socket.emit('send password', email.val());
      }

      return false;
    });
  }

  module.exports = forgotPassword;

} ();
