'use strict';

import should         from 'should';
import Mungo          from 'mungo';
import describe       from 'redtea';
import Type           from '../../models/type';
import isDocument     from './is-document';

function isType (type, compare = {}, serialized = false) {

  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', ok => ok());

    it('should be a document', describe.use(() => isDocument(type, compare, serialized)));

    if ( ! serialized ) {
      it('should be a type', (ok, ko) => {
        type.should.be.an.instanceof(Type);
        ok();
      });
    }

    it('should have a name', (ok, ko) => {
      type.should.have.property('name').which.is.a.String();
      ok();
    });

    if ( 'name' in compare ) {
      it('name should match compare', (ok, ko) => {
        type.name.should.be.exactly(compare.name);
        ok();
      });
    }
  };

}

export default isType;
