;(function () {

  /** Item Details Component
   *
   *  @function
   *  @return {Object} - Angular Directive Definition
   *  @example <div class="synapp-details" data-item="{{item._id}}"></div>
   */
  function DetailsDirective (DataFactory) {

    return {
      restrict: 'C',
      templateUrl: '/templates/details',
      scope: {
        itemId:   '@'
      },
      
      controller: function ($scope) {

        $scope.getItem = function (cb) {
          DataFactory.Item.get($scope.itemId)

            .success(cb);
          };

      },
      
      link: function ($scope, $elem, $attr) {
        $scope.state = 0;

        $elem
          .on('shown.bs.collapse', function (event) {
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

  module.exports = ['DataFactory', DetailsDirective];

})();
