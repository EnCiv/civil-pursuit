! function () {
  
  'use strict';

  var Form = require('./Form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function login ($vexContent) {
    var signForm = $('form[name="login"]');

    var form = new Form(signForm)

    form.send(function () {
      var domain = require('domain').create();
      
      domain.on('error', function (error) {
        //
      });
      
      domain.run(function () {
        
        $.ajax({
          url: '/sign/in',
          type: 'POST',
          data: {
            email: form.labels.email.val(),
            password: form.labels.password.val()
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

            $('.topbar .is-out').remove();

            vex.close($vexContent.data().vex.id);

            // $('.login-modal').modal('hide');

            // signForm.find('section').hide(2000);

          });

      });
    });
  }

  module.exports = login;

} ();
