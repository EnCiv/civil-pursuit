module.exports = function (EntryFactory, TopicFactory, CriteriaFactory) {
  return {
    restrict: 'C',
    link: function ($scope, $elem, $attrs) {

      var entry = $attrs.entry;

      EntryFactory.findById(entry)

        .success(function (data) {
          $scope.entry = data.found;

          TopicFactory.findById($scope.entry.topic)

            .success(function (data) {
              $scope.topic = data.found;
            });
        });

      CriteriaFactory.find()

        .success(function (data) {
          $scope.criterias = data.found;
        });
    }
  };
};