;(function () {

  module.exports = ['$rootScope', '$timeout', 'DataFactory', PanelComponent];

  function PanelComponent ($rootScope, $timeout, DataFactory) {
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

        $scope.elem = $elem;

        

        // setTimeout(function () {

        //   var ellipsis = require('../lib/ellipsis');

        //   // $timeout(ellipsis.bind($elem.find('.box')), 0);
        //   ellipsis.apply($elem.find('.box').not('.prefetch'));
        //   // $(window).on('resize', ellipsis.bind($elem.find('.item-text')))

        // }, 500);
      }
    };
  }

})();
