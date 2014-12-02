;(function () {

  module.exports = [View];

  function View () {
    return {

      scrollToPointOfAttention: function (pointOfAttention, cb, speed) {

        var poa = (pointOfAttention.offset().top - 80);

        var current = $(document).scrollTop();

        console.log(current - poa)

        if ( 
          (current === poa) || 
          (current > poa && (current - poa < 50)) ||
          (poa > current && (poa - current < 50)) ) {
          return cb();
        }

        $('html').animate({
          scrollTop: poa
        }, speed || 250, 'swing', cb);
      }

    };
  }

})();
