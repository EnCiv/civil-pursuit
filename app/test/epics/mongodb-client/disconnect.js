'use strict';

import describe from 'redtea';

function use(props = {}) {
  const locals = {};

  return it => {

    it('disconnect client', () => props.mongodb.disconnect());

  };
}

const disconnectClient = props => describe('Disconnect MongoDB client', use(props));

disconnectClient.use = use;

export default disconnectClient;
