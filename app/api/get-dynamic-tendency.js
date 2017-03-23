'use strict';

import PoliticalTendency from '../models/political-tendency';

function getDynamicTendency (cb) {
  PoliticalTendency.find().then(cb).catch(this.error.bind(this));
}

export default getDynamicTendency;
