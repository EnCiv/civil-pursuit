'use strict';

import Mungo            from 'mungo';
import should           from 'should';
import describe         from 'redtea';
import isObjectID       from './is-object-id';

function isDocument(document, compare = {}, serialized = false) {
  return it => {

    if ( serialized ) {
      it('should be an object', (ok, ko) => {
        document.should.be.an.Object();
        ok();
      });
    }
    else {
      it('should be an instance of Model', (ok, ko) => {
        document.should.be.an.instanceof(Mungo.Model);
        ok();
      });
    }

    it ( '_id', [ it => {
      it('should have an _id', (ok, ko) => {
        document.should.have.property('_id');
        ok();
      });

      it('should be an Object ID', describe.use(() => isObjectID(document._id, compare._id, serialized)));
    }]);

    it('should have a document version', (ok, ko) => {
      document.should.have.property('__v');
      ok();
    });

    it('document version should be a number', (ok, ko) => {
      document.__v.should.be.a.Number();
      ok();
    });

    it('should have a model version', (ok, ko) => {
      document.should.have.property('__V');
      ok();
    });

    it('model version should be a number', (ok, ko) => {
      document.__V.should.be.a.Number();
      ok();
    });
  };
}

export default isDocument;
