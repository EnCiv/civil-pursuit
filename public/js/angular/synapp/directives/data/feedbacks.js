module.exports = function (FeedbackFactory) {
  return {
    restrict: 'C',
    link: function ($scope, $elem, $attr) {
      FeedbackFactory.find({
        entry: $attr.entry,
        topic: $attr.topic,
        user: $attr.email
      })
        .success(function (feedbacks) {
          $scope.feedbacks = feedbacks;
        });
    }
  };
};