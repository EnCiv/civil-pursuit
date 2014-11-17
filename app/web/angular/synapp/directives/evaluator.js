;(function () {

  module.exports = ['$timeout', Evaluator];

  function Evaluator ($timeout) {
    return {
      restrict: 'C',
      link: function ($scope) {
        $scope.closeEvaluation = function (inprogress) {
          if ( ! inprogress ) {
            $timeout(function () {
              $scope.$show = "-";
            }, 500);
            $timeout(function () {
              $scope.$show = "details";
            }, 1000);
            $timeout(function () {
              $scope.$root.evaluations = $scope.$root.evaluations
                .filter(function (evaluation) {
                  return evaluation.item !== $scope.item._id;
                });
            }, 1000);
          }
        };
      }
    };
  }

})();
