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
      controller: ['$scope', function ($scope) {
        $scope.item = {
          type: $scope.type
        };

        if ( $scope.parent ) {
          $scope.item.parent = $scope.parent;
        }

        $scope.getImage = function () {
          if ( Array.isArray($scope.$root.uploadResult) && $scope.$root.uploadResult.length ) {
            return $scope.$root.uploadResult[0].path.split(/\//).pop();
          }
        };

        $scope.save = function () {

          var item = {
            type: $scope.item.type,
            subject: $scope.item.subject,
            description: $scope.item.description,
            image: $scope.getImage()
          }

          if ( $scope.parent ) {
            item.parent = $scope.parent;
          }

          if ( $scope.item.references[0] ) {
            item.references = [];

            for ( var i in $scope.item.references ) {
              item.references[+i] = $scope.item.references[i];
            }
          }

          console.log('item', item);

          DataFactory.Item.create(item)
            .success(function (item) {
              $rootScope.items = [item].concat($rootScope.items);
              $scope.$parent.show = 'items';
            })
        };
      }]
    };
  }

})();