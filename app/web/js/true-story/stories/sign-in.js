! function () {

  'use strict';

  function signIn () {
    var app = this;

    app.view('sign').on('submit', function () {

      app.view('sign').find('.sign-error')
        .text('')
        .hide();

      var email = app.view('sign').find('[name="email"]');
      var password = app.view('sign').find('[name="password"]');

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
          .success(function (data) {
            $('.is-in').css('visibility', 'visible');

            app.view('sign').find('section').hide(2000);

            app.view('sign').find('.sign-success')
              .show(function () {
                setTimeout(function () {
                  app.view('sign').hide(2500);
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
