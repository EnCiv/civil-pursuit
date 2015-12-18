'use strict';

import should               from 'should';
import describe             from 'redtea';
import randomString         from '../../lib/util/random-string';

function test () {

  const locals = {};

  return describe ( 'Lib / Util / Random String' , [
    {
      'should be a function' : () =>  {
        randomString.should.be.a.Function();
      }
    },
    {
      'should be a promise' : () => {
        locals.promise = randomString(10);
        locals.promise.should.be.an.instanceof(Promise);
      }
    },
    {
      'should fulfill' : () => new Promise((ok, ko) => {
        locals.promise.then(
          string => {
            locals.string = string;
            ok();
          },
          ko
        );
      })
    },
    {
      'should generate a random string of 10 characters' : (ok, ko) => {
        locals.string.should.be.a.String().and.have.length(10);
      }
    }
  ] );

}


export default test;
