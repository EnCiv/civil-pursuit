! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function toSlug (str) {
    return require('string')(str).slugify().s;
  }

  module.exports = toSlug;

} ();
