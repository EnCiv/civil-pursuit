'use strict';

import should         from 'should';
import Mungo          from 'mungo';
import describe       from 'redtea';
import Type           from 'syn/../../dist/models/type';
import isDocument     from './document';
import isObjectID     from './object-id';

function isType (type, compare = {}, serialized = false) {

  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', () => {});

    if ( ! serialized ) {
      it('should be a type', (ok, ko) => {
        type.should.be.an.instanceof(Type);
      });

      it('should be a document', describe.use(() => isDocument(type, compare, serialized)));
    }

    else {
      it('should be an object', () => type.should.be.an.Object());
    }

    it('name', it => {
      it('should have a name', (ok, ko) => {
        type.should.have.property('name').which.is.a.String();
      });

      if ( 'name' in compare ) {
        it(`name should be ${compare.name}`, (ok, ko) => {
          type.name.should.be.exactly(compare.name);
        });
      }
    });

    it('id', it => {
      it('should have an id', (ok, ko) => {
        type.should.have.property('id').which.is.a.String();
      });

      if ( 'id' in compare ) {
        it('id should match compare', (ok, ko) => {
          type.id.should.be.exactly(compare.id);
        });
      }
    });

    if ( 'parent' in type ) {
      it('parent should be an Object ID',
        describe.use(() => isObjectID(type.parent))
      );
    }

    if ( 'harmony' in type ) {
      it('harmony should be an array',
        () => type.harmony.should.be.an.Array()
      );

      type.harmony.forEach(harmony =>
        it('harmony should be an Object ID',
          describe.use(() => isObjectID(harmony, null, serialized))
        )
      );
    }
  };

}

export default isType;
