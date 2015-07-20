'use strict';

import VoteModel          from '../../vote';
import FeedbackModel      from '../../feedback';
import CriteriaModel      from '../../criteria';

function getItemDetails (itemId) {
  return new Promise((ok, ko) => {
    try {
      let promises = [
        VoteModel.getAccumulation(itemId),
        FeedbackModel.find({ item : itemId}).exec(),
        CriteriaModel.find().limit(4).exec()
      ];

      Promise
        .all(promises)
        .then(
          results => {
            try {
              let [ votes, feedback, criterias ] = results;

              this
                .findById(itemId)
                .exec()
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
