'use strict';

import sequencer          from 'sequencer';
import VoteModel          from '../../vote';
import FeedbackModel      from '../../feedback';
import CriteriaModel      from '../../criteria';

function getItemDetails (item) {
  return sequencer.pipe(

    () => Promise.all([
      VoteModel.getAccumulation(item),
      FeedbackModel.find({ item }),
      CriteriaModel.find({}, { limit : 4 }),
      this.findById(item)
    ]),



    results => new Promise((ok, ko) => {
      const [ votes, feedback, criterias, item ] = results;

      ok({ votes, feedback, criterias, item,
        popularity : item.getPopularity()
      });
    })

  );
}

export default getItemDetails;
