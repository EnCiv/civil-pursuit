'use strict';

class Popularity {
  constructor (number, views, promotions) {
    this.number       =   number;
    this.views        =   views;
    this.promotions   =   promotions;
    this.ok           =   typeof number === 'number' &&
      isFinite(number) &&
      number <= 100 &&
      number >= 0;
  }

  toString () {
    if ( this.ok ) {
      return this.number.toString() + '%';
    }

    return '50%';
  }

  static getPopularity () {
    const multiplyBy100 = this.promotions * 100;

    if ( multiplyBy100 === 0 ) {
      return new Popularity(0, this.views, this.promotions);
    }

    const divideByViews = Math.ceil(multiplyBy100 / this.views);

    return new Popularity(divideByViews, this.views, this.promotions);
  }
}

const { getPopularity } = Popularity;

export { getPopularity as default, Popularity };
