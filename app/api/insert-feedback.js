'use strict';

import FeedbackModel from '../models/feedback';

function insertFeedback (event, itemId, value) {
  try {
    let feedback = {
      item : itemId,
      user : this.synuser.id,
      feedback : value
    };

    FeedbackModel
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
