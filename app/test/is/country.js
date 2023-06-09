'use strict';

import should         from 'should';
import Mungo          from 'mungo';
import describe       from 'redtea';
import Country        from 'syn/../../dist/models/country';
import isDocument     from './document';

function isCountry (country, compare = {}, serialized = false) {

  return it => {

    it(serialized ? 'should be serialized' : 'should not be serialized', () => {});

    it('should be a document', describe.use(() => isDocument(country, compare, serialized)));

    if ( ! serialized ) {
      it('should be a country', (ok, ko) => {
        country.should.be.an.instanceof(Country);
      });
    }

    it('should have a name', (ok, ko) => {
      country.should.have.property('name').which.is.a.String();
    });

    if ( 'name' in compare ) {
      it('name should match compare', (ok, ko) => {
        country.name.should.be.exactly(compare.name);
      });
    }
  };

}

export default isCountry;
