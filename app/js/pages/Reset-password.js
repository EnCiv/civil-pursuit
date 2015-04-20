! function () {
  
  'use strict';

  var Synapp = require('../Synapp');
  var Sign = require('../Sign');
  var ResetPassword = require('../Reset-password');

  window.app = new Synapp();

  app.connect(function () {
    new Sign().render();

    new ResetPassword().render();
  });

} ();
