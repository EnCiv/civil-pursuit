'use strict';

import PoliticalTendency from '../models/political-tendency';

function getPoliticalTendency (cb) {
	console.info("getPoliticalTendency:", this);
  PoliticalTendency.find().then(cb).catch(this.error.bind(this));
}

export default getPoliticalTendency;
