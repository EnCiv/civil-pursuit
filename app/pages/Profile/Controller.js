! function Page_Profile_Controller () {
  
  'use strict';

  var Synapp = require('syn/app');
  var Sign = require('syn/components/Sign/Controller');
  var Panel = require('syn/components/Panel/Controller');
  var Profile = require('syn/components/Profile/Controller');

  window.app = new Synapp();

  app.connect(function () {
    new Sign().render();

    new Profile().render();
  });

} ();
