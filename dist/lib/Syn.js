'use strict';

!(function () {

  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Syn() {}

  Syn.Function = function (fn) {
    this.fn = function () {
      fn = fn.bind;
      return fn();
    };
  };

  module.exports = Syn;
})();

// ... body