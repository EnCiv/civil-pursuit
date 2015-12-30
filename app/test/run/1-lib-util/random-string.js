'use strict';

import should               from 'should';
import describe             from 'redtea';
import randomString         from 'syn/../../dist/lib/util/random-string';

function test () {

  const locals = {};

  return describe ( 'Lib / Util / Random String' , it => {
    it('should be a function', () => randomString.should.be.a.Function());

    it('should be a promise', () => {
        locals.promise = randomString(10);
        locals.promise.should.be.an.instanceof(Promise);
      }
    );

    it('should fulfill', () => new Promise((ok, ko) => {
        locals.promise.then(
          string => {
            locals.string = string;
            ok();
          },
          ko
        );
      })
    );

    it('should generate a random string of 10 characters', () => {
        locals.string.should.be.a.String().and.have.length(10);
      }
    );
  });

}


export default test;
