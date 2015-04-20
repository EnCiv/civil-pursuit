! function () {
  
  'use strict';

  function mean (a, b) {
    var sum = a + b;

    if ( ! sum ) {
      return 0;
    }

    return Math.ceil((a / sum) * 100);
  }

  function getHarmony (pros, cons) {

    return mean(pros, cons);

  }

  module.exports = getHarmony;

} ();
