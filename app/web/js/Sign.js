/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  S   I   G   N

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Nav = require('./Nav');

  function Sign () {
    
  }

  Sign.prototype.render = function () {
    this.signIn();
    this.signUp();
    this.forgotPassword();

    app.socket.on('online users', function (online) {
      $('.online-users').text(online);
    });

    if ( ! synapp.user ) {
      $('.navbar .login-button').on('click', function () {
        $('#join.in').modal('hide');
        $('#forgot-password.in').modal('hide');
      });

      $('.navbar .join-button').on('click', function () {
        $('#login-modal.in').modal('hide');
        $('#forgot-password.in').modal('hide');
      });

      $('.login-submit').on('click', function () {
        $('#signer').submit();
      });
    }

    else {
      $('.navbar .is-out').remove();
    }
  };

  Sign.prototype.signIn = function() {
    var signForm = $('#signer');

    signForm.on('submit', function () {

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
  };

  Sign.prototype.signUp = function () {

    $('#join').find('.i-agree').on('click', function () {
      var agreed = $('#join').find('.agreed');

      if ( agreed.hasClass('fa-square-o') ) {
        agreed.removeClass('fa-square-o').addClass('fa-check-square-o');
      }
      else {
        agreed.removeClass('fa-check-square-o').addClass('fa-square-o');
      }
    });

    $('#join').find('form').on('submit', function () {
      
      var email = $(this).find('[name="email"]');
      var password = $(this).find('[name="password"]');
      var confirm = $(this).find('[name="confirm"]');

      email.removeClass('error');
      password.removeClass('error');
      confirm.removeClass('error');

      $('#join').find('.alert')
          .css('display', 'none');

      if ( ! email.val() ) {
        email.addClass('error').focus();
        $('#join').find('.alert')
          .css('display', 'block')
          .find('.alert-message').text('Please enter an email address');
      }

      else if ( ! password.val() ) {
        password.addClass('error').focus();
        $('#join').find('.alert')
          .css('display', 'block')
          .find('.alert-message').text('Please enter a password');
      }

      else if ( ! confirm.val() ) {
        confirm.addClass('error').focus();
        $('#join').find('.alert')
          .css('display', 'block')
          .find('.alert-message').text('Please confirm password');
      }

      else if ( password.val() !== confirm.val() ) {
        confirm.addClass('error').focus();
        $('#join').find('.alert')
          .css('display', 'block')
          .find('.alert-message').text('Passwords do not match');
      }

      else {
        $.ajax({
          url: '/sign/up',
          type: 'POST',
          data: {
            email: email.val(),
            password: password.val()
          }
        })
          
          .error(function (response, state, code) {
            if ( response.status === 401 ) {
              $('#join').find('.alert')
                .css('display', 'block')
                .find('.alert-message').text('This email address is already in use');
            }
          })
          
          .success(function (response) {
            synapp.user = response.user;
            
            $('.is-in').css('display', 'block');

            $('#join').modal('hide');

            $('#signer').find('section').hide(2000);

            $('#signer').find('.sign-success')
              .show(function () {
                setTimeout(function () {
                  $('#signer').hide(2500);
                }, 5000);
              })
              .text('Welcome to Synaccord!');
          });
      }

      return false;
    })
  };

  Sign.prototype.forgotPassword = function () {
    $('#forgot-password form[name="forgot-password"]').on('submit', function () {
    
      var email = $(this).find('[name="email"]');

      email.removeClass('error');

      if ( ! email.val() ) {
        email.addClass('error').focus();
      }

      else {
        app.socket.emit('send password', email.val());
      }

      return false;
    });
  };

  module.exports = Sign;

} ();
