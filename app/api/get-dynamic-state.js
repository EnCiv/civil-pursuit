'use strict';

import State from '../models/state';

function getDynamicState (cb) {
  State.find().limit(false)
    .then(cb)
    .catch(this.error.bind(this));
}

export default getDynamicState;
