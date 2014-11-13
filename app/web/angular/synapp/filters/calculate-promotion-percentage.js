;(function () {

  module.exports = [calculatePromotionPercentage];

  function calculatePromotionPercentage () {
    return function (item) {
      if ( item ) {
        if ( ! item.promotions ) {
          return 0;
        }
        return Math.floor(item.promotions * 100 / item.views);
      }
    }
  }
})();
