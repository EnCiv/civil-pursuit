;(function () {

  module.exports = [getFeedbacksByItem];

  function getFeedbacksByItem (getFeedbacksByItem) {
    return function (feedbacks, item_id) {
      if ( feedbacks ) {
        return feedbacks.filter(function (feedback) {
          return feedback.item === item_id;
        });
      }
    };
  }

})();
