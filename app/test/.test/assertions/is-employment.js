'use strict';

import should         from 'should';
import Mungo          from 'mungo';
import describe       from 'redtea';
import Employment     from '../../../models/employment';
import isDocument     from './is-document';

function isEmployment (employment, compare = {}, serialized = false) {

  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', () => {});

    it('should be a document', describe.use(() => isDocument(employment, compare, serialized)));

    if ( ! serialized ) {
      it('should be a employment', (ok, ko) => {
        employment.should.be.an.instanceof(Employment);
      });
    }

    it('should have a name', (ok, ko) => {
      employment.should.have.property('name').which.is.a.String();
    });

    if ( 'name' in compare ) {
      it('name should match compare', (ok, ko) => {
        employment.name.should.be.exactly(compare.name);
      });
    }
  };

}

export default isEmployment;
