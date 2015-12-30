'use strict';

import describe from 'redtea';
import should from 'should';

function isTopBar(client) {
  return it => {
    it('has a top bar', (ok, ko) => {
      client.isVisible('header[role="banner"].syn-top_bar').then(
        isVisible => {
          isVisible.should.be.true();
          ok();
        },
        ko
      );
    });
  };
}

export default isTopBar;
