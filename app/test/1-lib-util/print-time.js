'use strict';

import should               from 'should';
import describe             from 'redtea';
import printTime            from '../../lib/util/print-time';

function test () {

  const locals = {};

  return describe ( 'Lib / Util / Print time' , [
    {
      'should be a function' : () => {
        printTime.should.be.a.Function();
      }
    },
    {
      'should return array of 3' : () => {
        locals.time = printTime();
        locals.time.should.be.an.Array().and.have.length(3);
      }
    },
    {
      'should be strings' : () => {
        locals.time.forEach(time => time.should.be.a.String());
      }
    },
    {
      'should be numeric strings' : () => {
        locals.time.forEach(time => (+time).should.be.a.Number());
      }
    }
  ] );

}

export default test;
