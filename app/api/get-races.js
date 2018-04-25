'use strict';

import Race from '../models/race';

function getRaces (cb) {
  Race.find({deleted: {"$exists": false}}).sort({name: 1}).then(cb).catch(this.error.bind(this));
}

export default getRaces;
