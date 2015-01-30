; ! function () {

  'use strict';

  function scrollToPointOfAttention (pointOfAttention, cb, speed) {
    var poa = (pointOfAttention.offset().top - 80);

    var current = $('body,html').scrollTop();

    if ( typeof cb !== 'function' ) {
      cb = function () {};
    }

    if ( 
      (current === poa) || 
      (current > poa && (current - poa < 50)) ||
      (poa > current && (poa - current < 50)) ) {

      return typeof cb === 'function' ? cb() : true;
    }

    $.when($('body,html')
      .animate({
        scrollTop: poa + 'px'
      }, 500, 'swing'))
      .then(cb);

    // $('body,html').animate({
    //   scrollTop: poa + 'px'
    // }, speed || 500, 'swing', function () {
    //   if ( typeof cb === 'function' ) {
    //     cb();
    //   }
    // });
  }

  module.exports = scrollToPointOfAttention;

}();
