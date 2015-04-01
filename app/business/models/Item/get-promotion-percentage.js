! function () {
  
  'use strict';

  function Percentage (number) {
    this.number = number;

    this.ok = typeof number === 'number' && isFinite(number) && number <= 100 && number >= 0;
  }

  Percentage.prototype.toString = function() {
    if ( this.ok ) {
      return this.number.toString() + '%';
    }

    return '~80%';
  };

  function getPromotionPercentage () {

    var multiplyBy100 = this.promotions * 100;

    if ( multiplyBy100 === 0 ) {
      return new Percentage(0);
    }

    var divideByViews = Math.ceil(multiplyBy100 / this.views);

    return new Percentage(divideByViews);
  }

  module.exports = getPromotionPercentage;

} ();
