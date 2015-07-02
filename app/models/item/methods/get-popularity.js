! function () {
  
  'use strict';

  function Percentage (number, views, promotions) {
    this.number       =   number;
    this.views        =   views;
    this.promotions   =   promotions;
    this.ok           =   typeof number === 'number' &&
      isFinite(number) &&
      number <= 100 &&
      number >= 0;
  }

  Percentage.prototype.toString = function() {
    if ( this.ok ) {
      return this.number.toString() + '%';
    }

    return '50%';
  };

  function getPopularity () {

    var multiplyBy100 = this.promotions * 100;

    if ( multiplyBy100 === 0 ) {
      return new Percentage(0, this.views, this.promotions);
    }

    var divideByViews = Math.ceil(multiplyBy100 / this.views);

    return new Percentage(divideByViews, this.views, this.promotions);
  }

  module.exports = getPopularity;

} ();
