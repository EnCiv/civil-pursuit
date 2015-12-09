'use strict';

import should               from 'should';
import describe             from 'redtea';
import printTime            from '../../lib/util/print-time';

function test () {

  const locals = {};

  return describe ( 'Lib / Util / Print time' , [
    {
      'should be a function' : (ok, ko) => {
        printTime.should.be.a.Function();
        ok();
      }
    },
    {
      'should return array of 3' : (ok, ko) => {
        locals.time = printTime();
        locals.time.should.be.an.Array().and.have.length(3);
        ok();
      }
    },
    {
      'should be strings' : (ok, ko) => {
        locals.time.forEach(time => time.should.be.a.String());
        ok();
      }
    },
    {
      'should be numeric strings' : (ok, ko) => {
        locals.time.forEach(time => (+time).should.be.a.Number());
        ok();
      }
    }
  ] );

}

export default test;
