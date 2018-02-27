'use strict';

import Feedback from '../models/feedback';

function getFeedback (itemId, cb) {

    if(!this.synuser) cb(null); // no user loggedin, no feedback
    const query = {
      item      :   itemId,
      user      :   this.synuser.id,
    };

    Feedback
      .findOne(query)
      .then(
        feedback => cb(feedback.toJSON()),
        cb(null)
        );
}

export default getFeedback;
