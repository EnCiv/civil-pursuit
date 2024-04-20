'use strict';

import Feedback from '../models/feedback';
import Mungo from 'mungo';

function updateFeedback (feedback) {
  if(!this.synuser) return;
  try {
    const query={item: feedback.item, user: this.synuser.id};
    if(feedback._id) query._id=Mungo.mongodb.ObjectID(feedback._id);
    // console.info("UpdateFeedback",{query},{feedback});
    Feedback.update(query, feedback, {upsert: true}).then(
      (result) => {console.info("UpdateFeedback",result)} ,
      this.error.bind(this)
    );
  }
  catch ( error ) {
    this.error(error);
  }
}

export default updateFeedback;
