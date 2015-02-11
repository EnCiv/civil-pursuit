! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function ResetPassword () {
    
  }

  ResetPassword.prototype.render = function () {
    this.form = $('#reset-password');

    this.form.on('submit', function () {
    
      var key = $(this).find('[name="key"]');
      var password = $(this).find('[name="password"]');
      var confirm = $(this).find('[name="confirm"]');

      key.removeclass('error');
      password.removeclass('error');
      confirm.removeclass('error');

      if ( ! key.val() ) {
        key.addClass('error').focus();
      }

      else if ( ! password.val() ) {
        password.addClass('error').focus();
      }

      else if ( ! confirm.val() || confirm.val() !== password.val() ) {
        confirm.addClass('error').focus();
      }

      else {
        // socket.emit('reset password', )
        console.log(location)
      }

      return false;
    });
  };

  module.exports = ResetPassword;

} ();
