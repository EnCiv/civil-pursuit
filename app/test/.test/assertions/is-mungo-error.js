'use strict';

import Mungo            from 'mungo';
import should           from 'should';

function isMungoError (error, code, message) {
  return it => {

    it ( 'should be a Mungo Error', (ok, ko) => {
      error.should.be.an.instanceof(Mungo.Error);
      ok();
    });

    it ( 'code' , [ it => {

      it ( 'should have a code' , (ok, ko) => {
        error.should.have.property('code')
        ok();
      });

      it ( `should be ${code}`, (ok, ko) => {
        error.code.should.be.exactly(code);
        ok();
      });

    }]);

    it ( 'message', [ it => {

      it ( 'should have a message' , (ok, ko) => {
        error.should.have.property('originalMessage');
        ok();
      });

      it ( `should be "${message}"` , (ok, ko) => {
        error.originalMessage.should.be.exactly(message);
        ok();
      });

    }]);
  };
}

export default isMungoError;
