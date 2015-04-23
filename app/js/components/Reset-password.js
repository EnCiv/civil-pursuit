! function () {
  
  'use strict';

  var Form = require('syn/js/providers/Form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function ResetPassword () {
    
  }

  ResetPassword.prototype.render = function () {
    this.form = $('#reset-password');

    var form = new Form(this.form);

    form.send(function () {

      if ( form.labels.password.val() !== form.labels.confirm.val() ) {
        return form.labels.confirm.addClass('error').focus();
      }

      $('.reset-password-loading.hide').removeClass('.hide');
      $('.reset-password-not-found').not('.hide').addClass('hide');

      var token;

      location.search.replace(/(\?|&)token=((.){10})/,
        function getToken (match, tokenBefore, tokenChain) {
          token = tokenChain;
        });

      var ko = function (error) {
        console.log(error);

        if ( error.message === 'No such key/token' ) {
          setTimeout(function () {
            $('.reset-password-loading').addClass('hide');

            $('.reset-password-not-found').removeClass('hide');
          }, 1000);
        }
      };

      app.socket.on('reset password ok', function (user) {
        setTimeout(function () {
          $('#reset-password .reset-password-loading').addClass('hide');

          $('#reset-password .reset-password-ok').removeClass('hide');

          $('#reset-password .form-section.collapse').addClass('hide');

          setTimeout(function () {
            $('.login-button').click();
          }, 2500);

          setTimeout(function () {
            $('.login-modal [name="email"]').focus();
          }, 3000);

        }, 1000);
      });

      app.socket.on('reset password ko', ko);

      app.socket.emit('reset password', form.labels.key.val(), token, form.labels.password.val());
    });

    // this.form.on('submit', function () {

    //   var key       =   $(this).find('[name="key"]');
    //   var password  =   $(this).find('[name="password"]');
    //   var confirm   =   $(this).find('[name="confirm"]');

    //   key.removeClass('error');

    //   password.removeClass('error');
      
    //   confirm.removeClass('error');

    //   if ( $('.reset-password-loading.in').length || $('.reset-password-ok.in').length ) {
    //     return false;
    //   }

    //   if ( $('.reset-password-not-found.in').length ) {
    //      $('.reset-password-not-found').collapse('hide');
    //   }

    //   if ( ! key.val() ) {
    //     key.addClass('error').focus();
    //   }

    //   else if ( ! password.val() ) {
    //     password.addClass('error').focus();
    //   }

    //   else if ( ! confirm.val() || confirm.val() !== password.val() ) {
    //     confirm.addClass('error').focus();
    //   }

    //   else {

    //     console.log('ping');

    //     $('.reset-password-loading').collapse('show');

    //     var token;

    //     location.search.replace(/(\?|&)token=((.){10})/,
    //       function getToken (match, tokenBefore, tokenChain) {
    //         token = tokenChain;
    //       });

    //     var ko = function (error) {
    //       console.log(error);

    //       if ( error.message === 'No such key/token' ) {
    //         setTimeout(function () {
    //           $('.reset-password-loading').collapse('hide');

    //           $('.reset-password-not-found').collapse('show');
    //         }, 1000);
    //       }
    //     };

    //     app.socket.on('reset password ok', function (user) {
    //       setTimeout(function () {
    //         $('#reset-password .reset-password-loading').collapse('hide');

    //         $('#reset-password .reset-password-ok').collapse('show');

    //         $('#reset-password .form-section.collapse').collapse('hide');

    //         setTimeout(function () {
    //           $('#login-modal').modal('show');
    //         }, 2500);

    //         setTimeout(function () {
    //           $('#login-modal [name="email"]').focus();
    //         }, 3500);

    //       }, 1000);
    //     });

    //     app.socket.on('reset password ko', ko);

    //     app.socket.emit('reset password', key.val(), token, password.val());

    //   }

    //   return false;
    // });
  };

  module.exports = ResetPassword;

} ();
