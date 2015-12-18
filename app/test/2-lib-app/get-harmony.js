'use strict';

import should               from 'should';
import describe             from 'redtea';
import getHarmony           from '../../lib/app/get-harmony';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Get Harmony' , [
    {
      'should be a function' : (ok, ko) => {
        getHarmony.should.be.a.Function();
      }
    },
    {
      '0/0 should be 0' : (ok, ko) => {
        getHarmony(0, 0).should.be.exactly(0);
      }
    },
    {
      '100/50 should be 67' : (ok, ko) => {
        getHarmony(100, 50).should.be.exactly(67);
      }
    },
    {
      '50/100 should be 34' : (ok, ko) => {
        getHarmony(50, 100).should.be.exactly(34);
      }
    }
  ] );

}

export default test;
