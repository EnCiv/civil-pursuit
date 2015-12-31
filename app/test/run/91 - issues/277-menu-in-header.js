'use strict';

import describe         from  'redtea';
import startDriver      from 'syn/../../dist/test/epics/selenium-driver/init';
import stopDriver       from 'syn/../../dist/test/epics/selenium-driver/end';

function issue277 (props) {
  return  describe('#277 - Menu in header', it => {
    const locals = {};

    it('start driver', describe.use(() => startDriver(locals)));


    it('end driver', describe.use(() => stopDriver(locals)));
  });
}

export default issue277;
