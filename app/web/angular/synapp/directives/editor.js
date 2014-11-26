;(function () {

  module.exports = ['DataFactory', '$timeout', Editor];

  function Editor (DataFactory, $timeout) {
    return {
      restrict: 'C',
      templateUrl: '/templates/editor',
      controller: ['$scope', function ($scope) {
        
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
            image: $scope.getImage() || $scope.item.image
          }

          if ( $scope.item.parent ) {
            item.parent = $scope.item.parent;
          }

          if ( $scope.item.references ) {
            item.references = [];

            for ( var i in $scope.item.references ) {
              item.references[+i] = $scope.item.references[i];
            }
          }

          console.log('item', item);

          DataFactory.Item.create(item)
            .success(function (item) {
              $scope.$root.items = [item].concat($scope.$root.items);
              $scope.$parent.show = 'items';

              $timeout(function () {
                
                var _scope = angular.element('#item-' + item._id).scope();

                _scope.$apply(function () {
                  _scope.$show = 'evaluator';
                });

                $scope.$root.itemViewed  = item._id;

                $scope.$root.lineage[item._id] = item.parent;
              });
            });
        };


      }]
    };
  }
})();
