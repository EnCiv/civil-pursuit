! function () {
  
  'use strict';

  function throwError (error, cb) {

    cb = cb || function (error) {

    };

    if ( error instanceof Error ) {
      this.create({
        name      : error.name,
        message   : error.message,
        code      : error.code,
        stack     : error.stack.split(/\n/),
        debug     : error.debug,
        repair    : error.repair
      }, cb);
    }
  }

  module.exports = throwError;

} ();
