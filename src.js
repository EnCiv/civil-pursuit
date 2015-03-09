! function () {
  
  'use strict';

  var path = require('path');

  function src (module, _path) {

    if ( module === 'config' ) {
      module = 'app/business/config.json';
    }

    if ( /^\/?models\//.test(module) ) {
      module = ('app/business/' + module).replace(/\/\//g, '/');
    }

    if ( /^\/?lib\//.test(module) ) {
      module = ('app/business/' + module).replace(/\/\//g, '/');
    }

    if ( /^\/?io(\/|$)/.test(module) ) {
      module = ('app/server/lib/' + module).replace(/\/\//g, '/');
    }

    if ( /^\/?server(\/|$)/.test(module) ) {
      module = ('app/' + module).replace(/\/\//g, '/');
    }

    return require(path.join(process.cwd(), _path || '', module));
  }

  module.exports = src;

  src.domain = function (onError, run) {
    var domain = require('domain').create();
    
    domain.on('error', onError);
    
    domain.run(function () {
      run(domain);
    });
  };

  src.domain.nextTick = function (onError, run) {
    process.nextTick(function () {
      var domain = require('domain').create();
      
      domain.on('error', onError);

      domain.run(function () {
        run(domain);
      });
    });
  };

} ();
