! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Syn () {
    // ... body
  }

  Syn.Function = function (fn) {
    this.fn = function () {
      fn = fn.bind
      return fn();
    };
  };

  module.exports = Syn;

} ();
