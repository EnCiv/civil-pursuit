'use strict';

import should               from 'should';
import describe             from 'redtea';
import Upload               from '../../../../lib/util/upload';

function test () {

  const locals = {};

  return describe ( 'Lib / Util / Upload' , it => {

    it('should be a function', () => Upload.should.be.a.Function())

  } );

}

export default test;
