;(function () {

  module.exports = [FeedbackFilter];

  function FeedbackFilter () {
    return function (feedbacks, feedback) {
      if ( feedbacks ) {
        return feedbacks.filter(function (_feedback) {
          for ( var key in feedback ) {
            if ( _feedback[key] !== feedback[key] ) {
              return false;
            }
          }
          return true;
        });
      }
    };
  }

})();
