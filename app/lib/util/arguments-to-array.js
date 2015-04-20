! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Lib__Util__ArgumentsToArray (args) {
    var ret = [];

    for ( var i in args ) {
      ret.push(args[i]);
    }

    return ret;
  }

  module.exports = Lib__Util__ArgumentsToArray;

} ();
