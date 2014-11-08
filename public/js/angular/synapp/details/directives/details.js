;(function () {

  module.exports = ['DataFactory', 'Channel', DetailsDirective];

  /** Item Details Component
   *
   *  @function
   *  @return {Object} - Angular Directive Definition
   *  @example <div class="synapp-details" data-item="{{item._id}}"></div>
   */
  function DetailsDirective (DataFactory, Channel) {

    return {
      restrict: 'C',
      templateUrl: '/templates/details',
      scope: {
        itemId:   '@',
        from: '@'
      },
      
      controller: function ($scope) {

        $scope.getItem = function (cb) {
          DataFactory.Item.get($scope.itemId)

            .success(cb);
          };

      },
      
      link: function ($scope, $elem, $attr) {
        $scope.state = 0;

        Channel
          .on($scope.itemId, 'details', function () {
            if ( ! $scope.state ) {
              $scope.state = 1;
              $scope.getItem(function (details) {
                $scope.state = 2;
                $scope.details = details;
                $scope.item = details.item;
              });
            }
          });
      }
    }; 
  }

})();
