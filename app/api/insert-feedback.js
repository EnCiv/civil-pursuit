'use strict';

import feedback from '../models/feedback';

function insertFeedback (event, itemId, value) {
  try {
    let feedback = {
      item : itemId,
      user : this.synuser.id,
      feedback : value
    };

    feedback
      .create(feedback)
      .then(
        inserted => this.ok(event, inserted),
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default insertFeedback;
