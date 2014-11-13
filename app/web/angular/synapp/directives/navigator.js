;(function () {

  module.exports = ['$rootScope', '$compile', 'DataFactory', NavigatorComponent];

  function NavigatorComponent ($rootScope, $compile, DataFactory) {
    return {
      restrict: 'C',
      templateUrl: '/templates/navigator',
      scope: {
        type:' @',
        parent: '@'
      },
      controller: ['$scope', function ($scope) {
        $scope.loadChildren = function (item_id) {

          var item = $rootScope.items.reduce(function (item, _item) {
            if ( _item._id === item_id ) {
              item = _item;
            }
            return item;
          }, null);

          var scope = $scope.$new();

          compile(item, $('#item-' + item_id), scope, $compile);

          // DataFactory.Item.find({ parent: item_id })
          //   .success(function (items) {
          //     $rootScope.feedbacks = $rootScope.feedbacks.concat(feedbacks);
          //   });
        };
        
      }],
      link: function ($scope, $elem, $attrs) {
      }
    };
  }

})();