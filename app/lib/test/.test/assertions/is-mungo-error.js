'use strict';

import Mungo            from 'mungo';
import should           from 'should';

function isMungoError (error, code, message) {
  return it => {

    it ( 'should be a Mungo Error', (ok, ko) => {
      error.should.be.an.instanceof(Mungo.Error);
    });

    it ( 'code' , [ it => {

      it ( 'should have a code' , (ok, ko) => {
        error.should.have.property('code')
      });

      it ( `should be ${code}`, (ok, ko) => {
        error.code.should.be.exactly(code);
      });

    }]);

    it ( 'message', [ it => {

      it ( 'should have a message' , (ok, ko) => {
        error.should.have.property('originalMessage');
      });

      it ( `should be "${message}"` , (ok, ko) => {
        error.originalMessage.should.be.exactly(message);
      });

    }]);
  };
}

export default isMungoError;
