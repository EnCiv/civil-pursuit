'use strict';

import Mungo            from 'mungo';
import should           from 'should';
import describe         from 'redtea';
import isObjectID       from './object-id';

function isDocument(document, compare = {}, serialized = false) {
  return it => {

    if ( serialized ) {
      it('should be an object', (ok, ko) => {
        document.should.be.an.Object();
      });
    }
    else {
      it('should be an instance of Model', (ok, ko) => {
        document.should.be.an.instanceof(Mungo.Model);
      });
    }

    it ( '_id', [ it => {
      it('should have an _id', (ok, ko) => {
        document.should.have.property('_id');
      });

      it('should be an Object ID', describe.use(() => isObjectID(document._id, compare._id, serialized)));
    }]);

    it('should have a document version', (ok, ko) => {
      document.should.have.property('__v');
    });

    it('document version should be a number', (ok, ko) => {
      document.__v.should.be.a.Number();
    });

    it('should have a model version', (ok, ko) => {
      document.should.have.property('__V');
    });

    it('model version should be a number', (ok, ko) => {
      document.__V.should.be.a.Number();
    });
  };
}

export default isDocument;
