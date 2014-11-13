;(function () {

  module.exports = [Evaluator];

  function Evaluator () {
    return {
      restrict: 'C',
      controller: function ($scope) {
        $scope.limit = 5;
      }
    };
  }

})();
