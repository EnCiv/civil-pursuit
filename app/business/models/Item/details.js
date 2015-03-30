! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function getItemDetails (id, cb) {
    var self = this;

    src.domain.nextTick(cb, function getItemDetailsDomain (domain) {

      require('async').parallel({
          votes: function getVotes (then) {
            require('./Vote').getAccumulation(id, then);
          },

          feedback: function getFeedback (then) {
            require('./Feedback').find({ item: id }, then);
          }
        },

        domain.intercept(function afterParallels (results) {

          self.findById(id, domain.intercept(function onItem (item) {

            /** Get type criterias */

            require('./Criteria')
              
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
