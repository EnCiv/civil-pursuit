! function Page_ResetPassword_Controller () {
  
  'use strict';

  var Synapp          =   require('../../app');
  var Sign            =   require('../../components/sign/ctrl');
  var ResetPassword   =   require('../../components/reset-password/ctrl');

  window.app          =   new Synapp();

  app.connect(function () {
    new Sign().render();

    new ResetPassword().render();
  });

} ();
