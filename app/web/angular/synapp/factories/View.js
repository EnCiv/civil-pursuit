;(function () {

  module.exports = [View];

  function View () {
    return {

      scrollToPointOfAttention: function (pointOfAttention, cb, speed) {

        var poa = (pointOfAttention.offset().top - 80);

        var current = $('body').scrollTop();

        console.info('scrolling to PoA', poa);

        if ( 
          (current === poa) || 
          (current > poa && (current - poa < 50)) ||
          (poa > current && (poa - current < 50)) ) {

          console.warn('ALREADY PoA')
          return cb();
        }

        $('body').animate({
          scrollTop: poa + 'px'
        }, speed || 500, 'swing', function () {
          console.info('scrolled to PoA', poa);
          cb();
        });
      }

    };
  }

})();
