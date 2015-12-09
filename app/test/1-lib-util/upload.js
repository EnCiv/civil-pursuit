'use strict';

import should               from 'should';
import describe             from 'redtea';
import Upload               from '../../lib/util/upload';

function test () {

  const locals = {};

  return describe ( 'Lib / Util / Upload' , [
    {
      'should be a function' : (ok, ko) => {
        Upload.should.be.a.Function();
        ok();
      }
    }
  ] );

}

export default test;
