'use strict';

import ItemModel from '../models/item';
import run from '../lib/util/run';

function getEvaluation (event, itemId) {
  run(
    d => {
      ItemModel
        .evaluate(this.synuser.id, itemId)
        .then(
          evaluation => this.ok(event, evaluation),
          this.error.bind(this)
        );
    },
    this.error.bind(this)
  );
}

export default getEvaluation;
