'use strict';

import PoliticalTendency from '../models/political-tendency';

function getPoliticalTendency (cb) {
  PoliticalTendency.find().then(cb).catch(this.error.bind(this));
}

export default getPoliticalTendency;
