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
    it('should be an object', (ok, ko) => {
      try {
        popularity.should.be.an.Object();
        ok();
      }
      catch ( error ) {
        ko(error);
      }
    });

    it('should be a Popularity', (ok, ko) => {
      try {
        popularity.should.be.an.instanceof(Popularity);
        ok();
      }
      catch ( error ) {
        ko(error);
      }
    });

    it(`should have ${views} views`, (ok, ko) => {
      try {
        popularity.should.have.property('views')
          .which.is.exactly(views);
        ok();
      }
      catch ( error ) {
        ko(error);
      }
    });

    it(`should have ${promotions} promotions`, (ok, ko) => {
      popularity.should.have.property('promotions')
        .which.is.exactly(promotions);
      ok();
    });

    it(`number should be ${number}`, (ok, ko) => {
      popularity.should.have.property('number')
        .which.is.exactly(number);
      ok();
    });

    it(isOKString, (ok, ko) => {
      if ( isOK ) {
        popularity.should.have.property('ok')
          .which.is.true();
      }
      else {
        popularity.should.have.property('ok')
          .which.is.false();
      }
      ok();
    });

    it(`string should be "${string}"`, (ok, ko) => {
      popularity.toString().should.be.exactly(string);
      ok();
    });
  };
}

export default isPopularity;
