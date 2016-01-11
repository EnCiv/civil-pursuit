'use strict';

import should from 'should';

function isError (error, code, message) {
  return it => {

    it ( 'should be an Error', (ok, ko) => {
      error.should.be.an.Error();
    });

    if ( code ) {
      it ( 'code' , [ it => {

        it ( 'should have a code' , (ok, ko) => {
          error.should.have.property('code')
        });

        it ( `should be ${code}`, (ok, ko) => {
          error.code.should.be.exactly(code);
        });

      }]);
    }

    if ( message ) {
      it ( 'message', [ it => {

        it ( 'should have a message' , (ok, ko) => {
          error.should.have.property('message');
        });

        it ( `should be "${message}"` , (ok, ko) => {
          error.message.should.be.exactly(message);
        });

      }]);
    }

  };
}

export default isError;
