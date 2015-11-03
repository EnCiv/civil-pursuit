'use strict';

import { Evaluator } from '../../../lib/app/evaluate';

function evaluate (userId, itemId) {
  return new Promise((ok, ko) => {
    try {
      new Evaluator(userId, itemId)
        .on('error', ko)
        .evaluate()
        .then(ok, ko);
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default evaluate;
