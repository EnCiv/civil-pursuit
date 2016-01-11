'use strict';

import describe             from 'redtea';
import reset                from 'syn/../../dist/bin/reset';

function test (props = {}) {
  const locals = {};

  return describe('DB reset && migrate', it => {
    it('should reset and migrate', () => reset());
  });
}

export default test;
