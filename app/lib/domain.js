! function () {
  
  'use strict';

  function domainWrapper (onError, run) {
    
    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      onError(error);
    });
    
    domain.run(function () {
      run(domain);
    });

  }

  module.exports = domainWrapper;

} ();
