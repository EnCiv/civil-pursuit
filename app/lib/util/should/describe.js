! function () {
  
  'use strict';

  var should = require('should');

  if ( ! should.$describe ) {

    should.$describe = function (describe, it, then) {

      try {
        then(it);
      }
      catch ( error ) {
        console.log(Object.keys(error), error.operator, typeof error.expected, error.actual)

        var rethrow = new TypeError(' x ' + describe + ' > Expected ' + error.operator);

        throw rethrow;
      }

    };

  }

} ();
