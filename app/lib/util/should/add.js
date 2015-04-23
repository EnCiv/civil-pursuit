! function () {
  
  'use strict';

  var should = require('should');

  function add (name, assertion) {
    try {
      should.Assertion.add(name, assertion, true);
    }
    catch ( error ) {

      if ( error.name === 'TypeError' &&
        new RegExp('Cannot redefine property: ').test(error.message) ) {

        // Assertion item already loaded
      }

      else {
        throw error;
      }
      
    }
  }

  module.exports = add;

} ();
