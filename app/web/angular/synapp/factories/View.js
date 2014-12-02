;(function () {

  module.exports = [View];

  function View () {
    return {

      scrollToPointOfAttention: function (pointOfAttention, cb) {

        var poa = (pointOfAttention.offset().top - 80);

        var current = $(document).scrollTop();

        if ( current - poa < 50 ) {
          return cb();
        }

        $('html, body').animate({
          scrollTop: poa
        }, 250, 'swing', cb);
      }

    };
  }

})();
