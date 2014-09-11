// .synapp-topics

module.exports = function (TopicFactory, EvaluationFactory, SignFactory) {

  return {

    restrict: 'C',

    link: function ($scope) {
      $scope.selectedTopic =  'none';

      // select a topic

      $scope.selectMeAsTopic = function (id) {
        $scope.selectedTopic = id;
      };

      // Create a new evaluation and take user there

      $scope.evaluate = function (topicSlug) {
        TopicFactory.findBySlug(topicSlug)

          .success(function (topic) {

            SignFactory.findByEmail($scope.email)

              .success(function (user) {
                EvaluationFactory.create({
                  topic:    topic._id,
                  user:     user._id
                })

                  .success(function (created) {
                    location.href = '/evaluate/' + created._id;
                  });
              });
          });
      };

      // Get topics

      TopicFactory.find()
        .error(function (error) {
          console.error(error);
        })
        .success(function (topics) {
          $scope.topics = topics;
        });
    }
  };
};