// ----- Angular directive $('.synapp-sign') ---------------------------------------------------  //
/*
 *  @abstract Angular directive for all elements with class name "synapp-sign"
 *  @return   Object directive
 *  @param    Object TopicFactory
 */
// ---------------------------------------------------------------------------------------------  //
module.exports = function (TopicFactory, EvaluationFactory, SignFactory) { // ----- uses factory/Sign.js ------------------------  //
  return {
    // ---- Restrict directive to class --------------------------------------------------------  //
    restrict: 'C',
    // ---- Link function ----------------------------------------------------------------------  //
    link: function ($scope) {
      $scope.selectedTopic =  'none';

      $scope.selectMeAsTopic = function (id) {
        $scope.selectedTopic = id;
      };

      $scope.evaluate = function (topicSlug) {
        TopicFactory.findBySlug(topicSlug)

          .success(function (topic) {

            SignFactory.findByEmail($scope.email)

              .success(function (user) {
                EvaluationFactory.create({
                  topic:    topic.found._id,
                  user:     user.found._id
                })

                  .success(function (data) {
                    location.href = '/evaluate/' + data.created._id;
                  });
              });
          });
      };

      TopicFactory.find()
        .error(function (error) {
          console.error(error);
        })
        .success(function (data) {
          $scope.topics = data.found;
        });
    }
  };
};