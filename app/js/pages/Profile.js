! function () {
  
  'use strict';

  var Synapp = require('syn/js/Synapp');
  var Sign = require('syn/js/components/Sign');
  var Panel = require('syn/js/components/Panel');
  var Profile = require('syn/js/components/Profile');

  window.app = new Synapp();

  app.connect(function () {
    new Sign().render();

    new Profile().render();
  });

} ();
