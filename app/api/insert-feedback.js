'use strict';

import Feedback from '../models/feedback';

function insertFeedback (itemId, value) {
  try {
    const feedback = {
      item      :   itemId,
      user      :   this.synuser.id,
      feedback  :   value
    };

    console.log('create', feedback)

    Feedback
      .create(feedback)
      .then(
        inserted => {},
        error => this.error(error)
      );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default insertFeedback;
