'use strict';

import Race from '../models/race';

function getRaces (cb) {
  Race.find().then(cb).catch(this.error.bind(this));
}

export default getRaces;
