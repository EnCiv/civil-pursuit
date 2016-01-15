'use strict';

import sequencer          from 'sequencer';
import VoteModel          from '../../vote';
import FeedbackModel      from '../../feedback';
import CriteriaModel      from '../../criteria';

function getItemDetails (item) {
  return new Promise((ok, ko) => {
    try {
      Promise.all([
        VoteModel.getAccumulation(item),
        FeedbackModel.find({ item }),
        CriteriaModel.find({}, { limit : 4 }),
        this.findById(item)
      ])
      .then(results => {
        const [ votes, feedback, criterias, item ] = results;
        ok({ votes, feedback, criterias, item });
      })
      .catch(ko);
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default getItemDetails;
