! function () {
  
  'use strict';

  var Synapp = require('syn/js/Synapp');
  var Sign = require('syn/js/components/Sign');

  window.app = new Synapp();

  app.connect(function () {
    new Sign().render();
  });

} ();
