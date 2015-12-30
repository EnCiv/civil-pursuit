'use strict';

import describe from 'redtea';
import isTopBar from './e2e-is-top-bar';

function isNavigator(client) {
  return it => {
    it('should have a top bar', describe.use(() => isTopBar(client)));
  };
}

export default isNavigator;
