'use strict';

!(function () {

  'use strict';

  var should = require('should');

  if (!should.$describe) {

    should.$describe = function (describe, it, then) {

      try {
        then(it);
      } catch (error) {

        var rethrow = new TypeError(' x ' + describe + ' > Expected ' + error.operator);

        throw rethrow;
      }
    };
  }
})();