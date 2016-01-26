'use strict';

import sequencer          from 'sequencer';
import VoteModel          from '../../vote';
import FeedbackModel      from '../../feedback';
import CriteriaModel      from '../../criteria';

function getItemDetails (item) {
  return sequencer.pipe(

    () => Promise.all([
      VoteModel.getAccumulation(item),
      FeedbackModel.find({ item }).limit(5),
      CriteriaModel.find({}, { limit : 4 }),
      this.findById(item),
      FeedbackModel.count({ item })
    ]),



    results => new Promise((ok, ko) => {
      const [ votes, feedback, criterias, item, totalFeedback ] = results;

      ok({ votes, feedback, criterias, item,
        popularity : item.getPopularity(),
        totals : {
          feedback : totalFeedback
        }
      });
    })

  );
}

export default getItemDetails;
