'use strict';

import should               from 'should';
import describe             from 'redtea';
import sendEmail            from '../../lib/app/send-email';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Send email' , [
    {
      'should be a function' : (ok, ko) => {
        sendEmail.should.be.a.Function();
        ok();
      }
    },

    {
      'should return a promise' : (ok, ko) => {
        sendEmail().should.be.an.instanceof(Promise);
        ok();
      }
    }
  ] );

}

export default test;
