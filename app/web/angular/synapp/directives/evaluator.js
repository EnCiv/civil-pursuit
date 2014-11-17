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
          }
        };
      }
    };
  }

})();
