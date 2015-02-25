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

  Sign.dialog = {

    login: function () {

      vex.defaultOptions.className = 'vex-theme-flat-attack';

      var content = $($('#login-modal').html());

      vex.dialog.confirm({

        afterOpen: function () {
          $('.login-button')
            .off('click')
            .on('click', function () {
              vex.close();
            });
        },

        afterClose: function () {
          $('.login-button').on('click', Sign.dialog.login);
        },

        message: $('#login-modal').html(),
        buttons: [
           //- $.extend({}, vex.dialog.buttons.YES, {
           //-    text: 'Login'
           //-  }),

           $.extend({}, vex.dialog.buttons.NO, {
              text: 'x Close'
            })
        ],
        callback: function(value) {
          return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
        },
        defaultOptions: {
          closeCSS: {
            color: 'red'
          }
        }
      });
    },

    join: function () {

      vex.defaultOptions.className = 'vex-theme-flat-attack';

      vex.dialog.confirm({

        afterOpen: function () {
          $('.join-button')
            .off('click')
            .on('click', function () {
              vex.close();
            });
        },

        afterClose: function () {
          $('.join-button').on('click', Sign.dialog.join);
        },

        message: $('#join').html(),
        buttons: [
           //- $.extend({}, vex.dialog.buttons.YES, {
           //-    text: 'Login'
           //-  }),

           $.extend({}, vex.dialog.buttons.NO, {
              text: 'x Close'
            })
        ],
        callback: function(value) {
          return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
        },
        defaultOptions: {
          closeCSS: {
            color: 'red'
          }
        }
      });
    }

  };

  Sign.prototype.render = function () {
    this.signIn();
    this.signUp();
    this.forgotPassword();

    app.socket.on('online users', function (online) {
      $('.online-users').text(online);
    });

    if ( ! synapp.user ) {
      $('.login-button').on('click', Sign.dialog.login);
      $('.join-button').on('click', Sign.dialog.join);
      $('.topbar .is-in').hide();
    }

    else {
      $('.topbar .is-out').remove();
    }
  };

  Sign.prototype.signIn = require('./Sign/sign-in');

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

  Sign.prototype.forgotPassword = require('./Sign/forgot-password');

  module.exports = Sign;

} ();
