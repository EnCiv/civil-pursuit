'use strict';

import describe               from 'redtea';
import should                 from 'should';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Type                   from 'syn/../../dist/models/type';
import isType                 from 'syn/../../dist/test/is/type';

function testTypeGroup (props) {

  const locals = {};

  return testWrapper(
    'Type Model : Group',
    {
      mongodb : true
    },

    wrappers => it => {

    }
  );
}

export default testTypeGroup;
