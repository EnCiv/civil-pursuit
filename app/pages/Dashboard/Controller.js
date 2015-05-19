! function () {
  
  'use strict';

  var Syn = require('syn/app');
  window.app = new Syn();

  app.ready(function () {

    app.domain.run(function () {
      console.log('hello');
    });

  });

} ();
