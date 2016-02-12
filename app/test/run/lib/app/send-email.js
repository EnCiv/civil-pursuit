'use strict';

import should               from 'should';
import describe             from 'redtea';
import sendEmail            from '../../../../lib/app/send-email';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Send email' , it => {

    it('should be a function', () => {
        sendEmail.should.be.a.Function();
      }
    );

    it('should return a promise', () => {
        sendEmail().should.be.an.instanceof(Promise);
      }
    );

  });

}

export default test;
