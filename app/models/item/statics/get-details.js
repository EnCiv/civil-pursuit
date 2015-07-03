'use strict';

import VoteModel          from 'syn/models/vote';
import FeedbackModel      from 'syn/models/feedback';
import CriteriaModel      from 'syn/models/criteria';

function getItemDetails (itemId) {
  return new Promise((ok, ko) => {
    Promise
      .all([
        VoteModel.getAccumulation(itemId),
        FeedbackModel.find({ item : itemId }).exec()
      ])
      .then(
        results => {
          try {
            let [ votes, feedback ] = results;
            this
              .findById(itemId)
              .exec()
              .then(
                item => {
                  try {
                    CriteriaModel
                      .find({ type: item.type })
                      .exec()
                      .then(
                        criterias => {
                          try {
                            ok({
                              item      : item,
                              votes     : votes,
                              feedbacks : feedback,
                              criterias : criterias
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
        },
        ko
      );
  });
}

export default getItemDetails;
