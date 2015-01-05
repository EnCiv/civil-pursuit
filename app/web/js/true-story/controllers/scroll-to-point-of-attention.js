; ! function () {

  'use strict';

  function scrollToPointOfAttention (pointOfAttention, cb, speed) {
    var poa = (pointOfAttention.offset().top - 80);

    var current = $('body').scrollTop();

    if ( 
      (current === poa) || 
      (current > poa && (current - poa < 50)) ||
      (poa > current && (poa - current < 50)) ) {

      return cb();
    }

    $('body').animate({
      scrollTop: poa + 'px'
    }, speed || 500, 'swing', function () {
      cb();
    });
  }

  module.exports = scrollToPointOfAttention;

}();
