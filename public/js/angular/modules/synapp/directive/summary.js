module.exports = function (EntryFactory, TopicFactory, CriteriaFactory) {
  return {
    restrict: 'C',
    link: function ($scope, $elem, $attrs) {

      var entry = $attrs.entry;

      EntryFactory.findById(entry)

        .success(function (entry) {
          $scope.entry = entry;

          TopicFactory.findById($scope.entry.topic)

            .success(function (topic) {
              $scope.topic = topic;
            });
        });

      CriteriaFactory.find()

        .success(function (criterias) {
          $scope.criterias = criterias;
        });
    }
  };
};