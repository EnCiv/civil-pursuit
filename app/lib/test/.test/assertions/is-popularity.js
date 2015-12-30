'use strict';

import should from 'should';
import Popularity from '../../../lib/app/popularity';

function isPopularity (popularity, views, promotions, number, isOK, string) {

  if ( typeof number !== 'number' ) {
    number = Popularity.compute(views, promotions);
  }

  if ( typeof isOK !== 'boolean' ) {
    isOK = Popularity.verify(number);
  }

  const isOKString = isOK ? 'should be OK' : 'should not be OK';

  if ( typeof string !== 'string' ) {
    string = Popularity.stringify(number);
  }


  return it => {
    it('should be an object', () => popularity.should.be.an.Object());

    it('should be a Popularity', () =>  popularity.should.be.an.instanceof(Popularity));

    it(`should have ${views} views`, () => popularity.should.have.property('views')
      .which.is.exactly(views));

    it(`should have ${promotions} promotions`, () => {
      popularity.should.have.property('promotions')
        .which.is.exactly(promotions);
    });

    it(`number should be ${number}`, () => {
      popularity.should.have.property('number')
        .which.is.exactly(number);
    });

    it(isOKString, () => {
      if ( isOK ) {
        popularity.should.have.property('ok')
          .which.is.true();
      }
      else {
        popularity.should.have.property('ok')
          .which.is.false();
      }
    });

    it(`string should be "${string}"`, () => {
      popularity.toString().should.be.exactly(string);
    });
  };
}

export default isPopularity;
