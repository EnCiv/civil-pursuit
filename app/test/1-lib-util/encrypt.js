'use strict';

import should               from 'should';
import describe             from 'redtea';
import encrypt              from '../../lib/util/encrypt';

function test () {

  const locals = {};

  return describe ( 'Lib / Util / Encrypt' , [
    {
      'should be a function' : (ok, ko) => {
        encrypt.should.be.a.Function();
        ok();
      }
    },
    {
      'should be a promise' : (ok, ko) => {
        locals.promise = encrypt('test');
        locals.promise.should.be.an.instanceof(Promise);
        ok();
      }
    },
    {
      'should return encrypted string' : (ok, ko) => {
        locals.promise.then(
          hash => {
            hash.should.be.a.String()
              .and.not.be.exactly('secret');
            ok();
          },
          ko
        );
      }
    }
  ] );

}

export default test;
