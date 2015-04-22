! function () {
  
  'use strict';

  function lib__util__is__lesserThan (max) {
    return function (value) {

      if ( typeof value === 'string' ) {
        return value.length < max;
      }

      else if ( typeof value === 'number' ) {
        return value < max;
      }

    };
  }

  module.exports = lib__util__is__lesserThan;

} ();
