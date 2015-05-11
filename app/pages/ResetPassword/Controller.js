! function Page_ResetPassword_Controller () {
  
  'use strict';

  var Synapp          =   require('syn/app');
  var Sign            =   require('syn/components/Sign/Controller');
  var ResetPassword   =   require('syn/components/ResetPassword/Controller');

  window.app          =   new Synapp();

  app.connect(function () {
    new Sign().render();

    new ResetPassword().render();
  });

} ();
