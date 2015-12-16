'use strict';

import describe             from 'redtea';
import reset                from '../../bin/reset';

function test (props = {}) {
  const locals = {};

  return describe('DB reset && migrate', it => {
    it('should reset and migrate', (ok, ko) => {
      reset().then(ok, ko);
    });
  });
}

export default test;
