'use strict';

import describe from 'redtea';
import isNavigator from './e2e-is-navigator';

function isHomePage(client) {
  return it => {
    it('is navigator', describe.use(() => isNavigator(client)));
  };
}

export default isHomePage;
