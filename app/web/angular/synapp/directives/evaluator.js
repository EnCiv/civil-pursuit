;(function () {

  module.exports = ['$timeout', Evaluator];

  function Evaluator ($timeout) {
    return {
      restrict: 'C',
      link: function ($scope, $elem) {
        $scope.closeEvaluation = function (inprogress) {
          if ( ! inprogress ) {
            $timeout(function () {
              $scope.$root.publish('toggle view', { item: $scope.item, view: 'details' });
            }, 500);

            $timeout(function () {
              $scope.$root.evaluations = $scope.$root.evaluations
                .filter(function (evaluation) {
                  return evaluation.item !== $scope.item._id;
                });
            }, 1000);
          }
        };

        $scope.editAndGoAgain = function (item) {
          $scope.$parent.show = "creator";
          $elem.closest('.panel').find('.creator').attr('subject', 'hello')
        };
      }
    };
  }

})();
