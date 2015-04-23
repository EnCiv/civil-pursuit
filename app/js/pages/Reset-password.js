! function () {
  
  'use strict';

  var Synapp = require('syn/js/Synapp');
  var Sign = require('syn/js/components/Sign');
  var ResetPassword = require('syn/js/components/Reset-Password');

  window.app = new Synapp();

  app.connect(function () {
    new Sign().render();

    new ResetPassword().render();
  });

} ();
