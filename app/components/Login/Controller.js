! function () {
  
  'use strict';

  var Form = require('syn/lib/util/Form');
  var Nav = require('syn/lib/util/Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function login ($vexContent) {
    var signForm = $('form[name="login"]');

    var form = new Form(signForm);

    function login () {
      app.domain.run(function () {

        if ( $('.login-error-404').hasClass('is-shown') ) {
          return Nav.hide($('.login-error-404'), app.domain.intercept(function () {
            form.send(login);
            form.form.submit();
          }))
        }

        if ( $('.login-error-401').hasClass('is-shown') ) {
          return Nav.hide($('.login-error-401'), app.domain.intercept(function () {
            form.send(login);
            form.form.submit();
          }))
        }
        
        $.ajax({
            url         :   '/sign/in',
            type        :   'POST',
            data        :   {
              email     :   form.labels.email.val(),
              password  :   form.labels.password.val()
            }})

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
    }

    form.send(login);
  }

  module.exports = login;

} ();
