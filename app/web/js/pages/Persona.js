! function () {
  
  'use strict';

  var Synapp = require('../Synapp');
  var Sign = require('../Sign');
  var Panel = require('../Panel');
  var Profile = require('../Profile');

  window.app = new Synapp();

  app.connect(function () {
    new Sign().render();

    new Profile().render();
  });

} ();
