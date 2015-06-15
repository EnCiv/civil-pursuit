'use strict';

import ItemModel from 'syn/models/Item';
import run from 'syn/lib/util/run';

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
