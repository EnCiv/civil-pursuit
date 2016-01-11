'use strict';

import should         from 'should';
import Mungo          from 'mungo';
import describe       from 'redtea';
import Criteria       from 'syn/../../dist/models/criteria';
import isDocument     from './document';

function isCriteria (criteria, compare = {}, serialized = false) {

  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', () => {});

    it('should be a document', describe.use(() => isDocument(criteria, compare, serialized)));

    if ( ! serialized ) {
      it('should be a criteria', (ok, ko) => {
        criteria.should.be.an.instanceof(Criteria);
      });
    }

    it('should have a name', (ok, ko) => {
      criteria.should.have.property('name').which.is.a.String();
    });

    if ( 'name' in compare ) {
      it('name should match compare', (ok, ko) => {
        criteria.name.should.be.exactly(compare.name);
      });
    }

    it('should have a description', (ok, ko) => {
      criteria.should.have.property('description').which.is.a.String();
    });

    if ( 'description' in compare ) {
      it('description should match compare', (ok, ko) => {
        criteria.description.should.be.exactly(compare.description);
      });
    }
  };

}

export default isCriteria;
