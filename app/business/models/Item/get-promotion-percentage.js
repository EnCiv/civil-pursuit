! function () {
  
  'use strict';

  // Math.ceil(item.item.promotions * 100 / item.item.views) + '%'

  function getPromotionPercentage () {
    var multiplyBy100 = this.promotions * 100;

    if ( multiplyBy100 === 0 ) {
      return '0%';
    }

    var divideByViews = Math.ceil(multiplyBy100 / this.views);

    return divideByViews + '%';
  }

  module.exports = getPromotionPercentage;

} ();
