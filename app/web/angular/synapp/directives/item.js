;(function () {

  module.exports = ['$rootScope', Item];

  function Item ($rootScope) {
    return {
      restrict: 'C',
      controller: ['$scope', function ($scope) {

        $scope.loaded = {};

        $scope.$watch('$show', function (show, _show) {
          if ( show && show !== _show ) {
            console.log('show', show, $scope.loaded[show])
            if ( ! $scope.loaded[show] ) {
              switch ( show ) {
                case 'children':
                  $scope.loaded.children = true;
                  $scope.$parent.loadChildren($scope.item._id);
                  break;

                case 'evaluator':
                  $scope.loaded.evaluator = true;
                  $scope.$root.loadEvaluation($scope.item._id);
                  break;

                case 'details':
                  $scope.loaded.details = true;
                  $scope.$root.loadDetails($scope.item._id);
                  break;
              }
            }
          }
        });
      }]
    };
  }
})();
