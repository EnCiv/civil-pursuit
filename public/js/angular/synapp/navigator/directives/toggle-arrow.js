;(function () {

  module.exports = ['$timeout', 'Channel', ToggleArrow];

  function ToggleArrow ($timeout, Channel) {
    return {
      restrict: 'CA',
      scope: {
        itemId: '@'
      },
      link: function ($scope, $elem, $attrs) {

        $scope.triggered = 0;

        $scope.toggle = false;

        var collapser = $elem.closest('.box-wrapper')
          .find('.nested-panels:first');

        $timeout(function () {
          $scope.is_nested = collapser.find('.synapp-navigator').length;
          $scope.is_nested = true;
        });

        collapser

          .on('show.bs.collapse', function ($event) {
            Channel.emit($scope.itemId, 'showing');
          })

          .on('shown.bs.collapse', function ($event) {
            if ( $($event.target).is(collapser) ) {
              $scope.$apply(function () {
                $scope.toggle = true;
              });
            }
          })
          
          .on('hidden.bs.collapse', function ($event) {
            if ( $($event.target).is(collapser) ) {
              $scope.$apply(function () {
                $scope.toggle = false;
              });
            }
          });
      
        $elem.on('click', function () {
          collapser.collapse('toggle');
        });
      }
    };
  }

})();
