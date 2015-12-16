'use strict';

import should               from 'should';
import describe             from 'redtea';
import config               from '../../../../public.json';
import makePanel            from '../../../lib/app/make-panel';
import Type                 from '../../../models/type';
import isType               from '../.test/assertions/is-type';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Make panel' , [ it => {

    it('should be a function', (ok, ko) => {
      makePanel.should.be.a.Function();
      ok();
    });

  }]);

}

export default test;
