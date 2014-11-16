;(function () {

  module.exports = [Evaluator];

  function Evaluator () {
    return {
      restrict: 'C',
      link: function ($scope) {
        $scope.continue = function () {
          console.log('lol');
        };
      }
    };
  }

})();
