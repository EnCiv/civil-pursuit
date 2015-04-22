! function () {
  
  'use strict';
  
  function getHarmony (a, b) {

    var sum = a + b;

    if ( ! sum ) {
      return 0;
    }

    return Math.ceil((a / sum) * 100);

  }

  module.exports = getHarmony;

} ();
