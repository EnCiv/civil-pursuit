;(function () {

  module.exports = [View];

  function View () {
    return {

      scrollToPointOfAttention: function (pointOfAttention, cb, speed) {

        var poa = (pointOfAttention.offset().top - 80);

        var current = $(document).scrollTop();

        if ( current - poa < 50 ) {
          return cb();
        }

        $('html, body').animate({
          scrollTop: poa
        }, speed || 250, 'swing', cb);
      }

    };
  }

})();
