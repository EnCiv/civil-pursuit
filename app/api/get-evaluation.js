'use strict';

import Item from '../models/item';

function getEvaluation (itemId, cb) {
  Item
    .evaluate(this.synuser.id, itemId)
    .then(
      cb,
      this.error.bind(this)
    );
}

export default getEvaluation;
