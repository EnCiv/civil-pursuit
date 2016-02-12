'use strict';

import should               from 'should';
import describe             from 'redtea';
import getHarmony           from '../../../../lib/app/get-harmony';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Get Harmony' , it => {

    it('should be a function', () => {
        getHarmony.should.be.a.Function();
      }
    );

    it('0/0 should be 0', () => {
        getHarmony(0, 0).should.be.exactly(0);
      }
    );

    it('100/50 should be 67', () => {
        getHarmony(100, 50).should.be.exactly(67);
      }
    );

    it('50/100 should be 34', () => {
        getHarmony(50, 100).should.be.exactly(34);
      }
    );

  });

}

export default test;
