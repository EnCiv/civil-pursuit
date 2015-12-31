'use strict';

import startDriver          from '../selenium-driver/init';
import stopDriver           from '../selenium-driver/end';
import createSimpleItem     from '../create/create-simple-item';

const label = 'Create Item';

export default props => describe => describe(label, it => {

  const mem = {};

  it('start driver', describe.use(() => startDriver(mem)));

  it('create simple item', describe.use(() => createSimpleItem(mem)));

  it('end driver', describe.use(() => stopDriver(mem)));

});
