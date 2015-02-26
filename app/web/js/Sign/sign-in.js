! function () {
  
  'use strict';

  var Form = require('../Form');

  /**
   *  @method Sign.signIn
   *  @return
   *  @arg
   */

  function signIn () {
    
    var signForm = $('form[name="login"]');

    console.log('sign in form', signForm.length);

    new Form(signForm)

      .send(function () {
        console.log('hahaha')
      });

    signForm.on('submit', function () {

      var domain = require('domain').create();
      
      domain.on('error', function (error) {
        throw error;
      });
      
      domain.run(function () {
        // ... code
      });

      return false;

      Nav.hide($('.login-error-401'));
      Nav.hide($('.login-error-404'));

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
          .error(function (response) {
            switch ( response.status ) {
              case 404:
                Nav.show($('.login-error-404'));
                break;

              case 401:
                Nav.show($('.login-error-401'));
                break;
            }
          })
          .success(function (response) {

            synapp.user = response.user;

            $('a.is-in').css('display', 'inline');

            $('.navbar .is-out').remove();

            $('#login-modal').modal('hide');

            signForm.find('section').hide(2000);

          });
      }

      return false;
    });
  }

  module.exports = signIn;

} ();
