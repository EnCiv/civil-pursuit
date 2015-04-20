! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function toCamelCase (str) {
    return require('string')(str).slugify().camelize().s;
  }

  module.exports = toCamelCase;

} ();
