! function () {
  
  'use strict';

  function nextTick (onError, run) {
    
    process.nextTick(function () {
      var domain = require('domain').create();
      
      domain.on('error', function (error) {
        onError(error);
      });
      
      domain.run(function () {
        run(domain);
      });
    });

  }

  module.exports = nextTick;

} ();
