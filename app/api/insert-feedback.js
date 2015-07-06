'use strict';

import FeedbackModel from '../models/feedback';

function insertFeedback (event, feedback) {
  try {
    if ( ! ( 'user' in feedback ) ) {
      feedback.user = this.synuser.id;
    }

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
