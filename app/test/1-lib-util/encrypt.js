'use strict';

import should               from 'should';
import describe             from 'redtea';
import encrypt              from '../../lib/util/encrypt';

function test () {

  const locals = {};

  return describe ( 'Lib / Util / Encrypt' , [
    {
      'should be a function' : () =>
        encrypt.should.be.a.Function()
    },
    {
      'should be a promise' : () => {
        locals.promise = encrypt('test');
        locals.promise.should.be.an.instanceof(Promise);
      }
    },
    {
      'should return encrypted string' : () => new Promise((ok, ko) => {
        locals.promise.then(
          hash => {
            hash.should.be.a.String()
              .and.not.be.exactly('secret');

            ok();
          },
          ko
        );
      })
    }
  ] );

}

export default test;
