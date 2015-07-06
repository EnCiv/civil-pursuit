! function () {
  
  'use strict';

  function getItemDetails (id, cb) {
    var self = this;

    require('../../../lib/domain/next-tick')(cb, function getItemDetailsDomain (domain) {

      require('async').parallel({
          votes: function getVotes (then) {
            require('../../../Vote').getAccumulation(id, then);
          },

          feedback: function getFeedback (then) {
            require('../../../Feedback').find({ item: id }, then);
          }
        },

        domain.intercept(function afterParallels (results) {

          self.findById(id, domain.intercept(function onItem (item) {

            /** Get type criterias */

            require('../../../Criteria')
              
              .find({ type: item.type }, domain.intercept(function onCriterias (criterias) {

                /** Return details */

                cb(null, {
                  item      : item,
                  votes     : results.votes,
                  feedbacks : results.feedback,
                  criterias : criterias
                });

              }));
          }));
        }));

    });

  }

  module.exports = getItemDetails;

} ();
