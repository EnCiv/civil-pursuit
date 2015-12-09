'use strict';

class Popularity {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static errorToString = '~80%'

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static compute (views, promotions) {
    if ( ! views || ! promotions ) {
      return 0;
    }

    const multiplyBy100 = promotions * 100;

    if ( multiplyBy100 === 0 ) {
      return 0;
    }
    else {
      return Math.ceil(multiplyBy100 / views);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static verify (number) {
    return (
      typeof number === 'number' &&
      isFinite(number) &&
      number <= 100 &&
      number >= 0
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static stringify (number) {
    const ok = this.verify(number);

    return ok ? number.toString() + '%' : this.errorToString;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (views, promotions) {
    this.views        =   views;
    this.promotions   =   promotions;
    this.number       =   Popularity.compute(views, promotions);
    this.ok           =   Popularity.verify(this.number);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toString () {
    return Popularity.stringify(this.number);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default Popularity;
