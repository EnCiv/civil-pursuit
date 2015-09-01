'use strict';

import TrainingModel from '../models/training';

function getTraining (event) {
  try {
    TrainingModel
      .find()
      .exec()
      .then(
        instructions => {
          this.ok(event, instructions);
        },
        this.error.bind(this)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default getTraining;
