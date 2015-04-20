! function () {

  'use strict';

  function signIn () {
    var app = this;

    var signForm = app.view('sign');

    signForm.on('submit', function () {

      signForm.find('.sign-error')
        .text('')
        .hide();

      var email = signForm.find('[name="email"]');
      var password = signForm.find('[name="password"]');

      email.removeClass('error');
      password.removeClass('error');

      if ( ! email.val() ) {
        email.addClass('error');
        email.focus();
      }

      else if ( ! password.val() ) {
        password.addClass('error');
        password.focus();
      }

      else {
        $.ajax({
          url: '/sign/in',
          type: 'POST',
          data: {
            email: email.val(),
            password: password.val()
          }
        })
          .error(function (error) {

          })
          .success(function (response) {

            synapp.user = response.user;

            $('.is-in').css('visibility', 'visible');

            signForm.find('section').hide(2000);

            signForm.find('.sign-success')
              .show(function () {
                setTimeout(function () {
                  signForm.hide(2500);
                }, 5000);
              })
              .text('Welcome back!');
          });
      }

      return false;
    });
  }

  module.exports = signIn;

} ();
