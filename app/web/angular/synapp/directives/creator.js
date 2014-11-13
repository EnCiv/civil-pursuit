;(function () {

  module.exports = ['$rootScope', 'DataFactory', Creator];

  function Creator ($rootScope, DataFactory) {
    return {
      restrict: 'C',
      templateUrl: '/templates/editor',
      scope: {
        type: '@',
        parent: '@'
      },
      controller: function ($scope) {
        $scope.item = {
          type: $scope.type
        };

        if ( $scope.parent ) {
          $scope.item.parent = $scope.parent;
        }

        $scope.save = function () {

          $scope.item.image = (function () {
            if ( Array.isArray($scope.$root.uploadResult) && $scope.$root.uploadResult.length ) {
                return $scope.$root.uploadResult[0].path.split(/\//).pop();
              }
          })();

          DataFactory.Item.create($scope.item)
            .success(function (item) {
              $rootScope.items = [item].concat($rootScope.items);
              $scope.$parent.show = 'items';
            })
        };
      }
    };
  }

})();