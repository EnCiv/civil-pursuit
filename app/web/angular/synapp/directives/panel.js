;(function () {

  module.exports = ['$rootScope', '$timeout', 'DataFactory', 'View', PanelComponent];

  function PanelComponent ($rootScope, $timeout, DataFactory, View) {
    return {
      restrict: 'C',
      templateUrl: '/templates/panel',
      scope: {
        type:' @',
        parent: '@'
      },
      controller: ['$scope', function ($scope) {

        $scope.batchSize = synapp['navigator batch size'];



        /** load more items */

        $scope.loadMore = function () {

          View.scrollToPointOfAttention($scope.elem.find('.load-more'), function () {

          });

          var query = { type: $scope.type, $skip: $scope.batchSize };

          if ( $scope.parent ) {
            query.parent = $scope.parent;
          }

          DataFactory.Item.find(query)
            .success(function (items) {
              $rootScope.items = $rootScope.items.concat(items);
              /** Lineage */

              items.forEach(function (item) {
                $rootScope.lineage[item._id] = item.parent;
              });

              $scope.batchSize += synapp['navigator batch size'];

              $timeout(function () {
                /*new Truncate($scope.elem);*/
              });
            });
        };
        
      }],
      link: function ($scope, $elem, $attrs) {

        $scope.saver = 'panel';

        $scope.elem = $elem;

        var id = 'panel-' + $scope.type;

        if ( $scope.parent ) {
          id += $scope.parent;
        }

        $elem.attr('id',  id);

      }
    };
  }

})();
