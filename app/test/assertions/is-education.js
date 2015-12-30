'use strict';

import should         from 'should';
import Mungo          from 'mungo';
import describe       from 'redtea';
import Education      from 'syn/../../dist/models/education';
import isDocument     from './is-document';

function isEducation (education, compare = {}, serialized = false) {

  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', () => {});

    it('should be a document', describe.use(() => isDocument(education, compare, serialized)));

    if ( ! serialized ) {
      it('should be a education', (ok, ko) => {
        education.should.be.an.instanceof(Education);
      });
    }

    it('should have a name', (ok, ko) => {
      education.should.have.property('name').which.is.a.String();
    });

    if ( 'name' in compare ) {
      it('name should match compare', (ok, ko) => {
        education.name.should.be.exactly(compare.name);
      });
    }
  };

}

export default isEducation;
