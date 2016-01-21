'use strict';

import State from '../models/state';

function getStates (cb) {
  State.find().limit(false)
    .then(cb)
    .catch(this.error.bind(this));
}

export default getStates;
