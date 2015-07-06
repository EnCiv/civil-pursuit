'use strict';

!(function () {

  'use strict';

  var should = require('should');

  function add(name, assertion) {
    try {
      should.Assertion.add(name, assertion, true);
    } catch (error) {

      if (error.name === 'TypeError' && new RegExp('Cannot redefine property: ').test(error.message)) {} else {
        throw error;
      }
    }
  }

  module.exports = add;
})();

// Assertion item already loaded