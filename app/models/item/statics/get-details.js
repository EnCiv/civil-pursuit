'use strict';

import VoteModel          from '../../../models/vote';
import FeedbackModel      from '../../../models/feedback';
import CriteriaModel      from '../../../models/criteria';

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
