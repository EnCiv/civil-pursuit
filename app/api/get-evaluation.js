'use strict';

import Item from '../models/item';

function getEvaluation (event, itemId) {
  try {

    console.log('------------------------------------------------------------');
    console.log('get evaluation', this.synuser.id, itemId);
    console.log('------------------------------------------------------------');

    Item
      .evaluate(this.synuser.id, itemId)
      .then(
        evaluation => this.ok(event, evaluation),
        this.error.bind(this)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default getEvaluation;
