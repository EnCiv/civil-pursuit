! function Page_ResetPassword_Controller () {
  
  'use strict';

  var Synapp          =   require('syn/app');
  var Sign            =   require('syn/components/sign/ctrl');
  var ResetPassword   =   require('syn/components/reset-password/ctrl');

  window.app          =   new Synapp();

  app.connect(function () {
    new Sign().render();

    new ResetPassword().render();
  });

} ();
