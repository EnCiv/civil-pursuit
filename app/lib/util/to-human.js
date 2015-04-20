! function () {
  
  'use strict';

  /**
   *  @function
   *  @return     {String}
   *  @arg        {String} str
   */

  function toHuman (str) {
    return require('string')(str).humanize().s;
  }

  module.exports = toHuman;

} ();
