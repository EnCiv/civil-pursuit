'use strict';

import PoliticalParty from '../models/political-party';

function getPoliticalParties (cb) {
  PoliticalParty.find().then(cb).catch(this.error.bind(this));
}

export default getPoliticalParties;
