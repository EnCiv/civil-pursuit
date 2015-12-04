'use strict';

import VoteModel          from '../../vote';
import FeedbackModel      from '../../feedback';
import CriteriaModel      from '../../criteria';

function getItemDetails (itemId) {
  return new Promise((ok, ko) => {
    try {
      const promises = [
        VoteModel.getAccumulation(itemId),
        FeedbackModel.find({ item : itemId}),
        CriteriaModel.find({}, { limit : 4 })
      ];

      Promise
        .all(promises)
        .then(
          results => {
            try {
              const [ votes, feedback, criterias ] = results;

              this
                .findById(itemId)
                .then(
                  item => {
                    try {
                      ok({
                        item  : item,
                        votes,
                        feedback,
                        criterias
                      });
                    }
                    catch ( error ) {
                      ko(error);
                    }
                  },
                  ko
                );
            }
            catch ( error ) {
              ko(error);
            }
          },
          ko
        );
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default getItemDetails;
