! function Page_TermsOfService_Controller () {
  
  'use strict';

  var Synapp    =   require('syn/app');
  var Sign      =   require('syn/components/Sign/Controller');

  window.app    =   new Synapp();

  app.connect(function () {
    new Sign().render();
  });

} ();
