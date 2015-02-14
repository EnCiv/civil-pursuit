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

    return require(path.join(process.cwd(), _path || '', module));
  }

  module.exports = src;

} ();
