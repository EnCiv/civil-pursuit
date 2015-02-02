! function () {
  
  'use strict';

  var Synapp = require('../Synapp');
  var Sign = require('../Sign');

  window.app = new Synapp();

  app.connect(function () {
    new Sign().render();
  });

} ();
