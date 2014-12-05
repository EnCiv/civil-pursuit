;(function () {

  module.exports = ['$rootScope', '$timeout', 'DataFactory', Creator];

  function Creator ($rootScope, $timeout, DataFactory) {
    return {
      restrict: 'C',
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

        $scope.save = function () { console.warn('hello');
          return;
          var item = {
            type: $scope.item.type,
            subject: $scope.item.subject,
            description: $scope.item.description,
            image: $scope.getImage()
          };

          if ( $scope.parent ) {
            item.parent = $scope.parent;
          }

          if ( $scope.item.references ) {
            item.references = [];

            for ( var i in $scope.item.references ) {
              item.references[+i] = $scope.item.references[i];
            }
          }

          DataFactory.Item.create(item)
            .success(function (item) {
              $rootScope.items = [item].concat($rootScope.items);
              $scope.$parent.show = 'items';

              $timeout(function () {
                
                var _scope = angular.element('#item-' + item._id).scope();

                _scope.$apply(function () {
                  _scope.$show = 'evaluator';
                });

                $rootScope.itemViewed  = item._id;

                $rootScope.lineage[item._id] = item.parent;
              });
            });
        };
      }],
      link: function ($scope, $elem, $attr) {
        
      }
    };
  }

})();
