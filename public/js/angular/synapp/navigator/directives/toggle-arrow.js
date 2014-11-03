;(function () {

  module.exports = ['$timeout', ToggleArrow];

  function ToggleArrow ($timeout) {
    return {
      restrict: 'CA',
      scope: true,
      link: function ($scope, $elem, $attrs) {
        $scope.toggle = false;

        var collapser = $elem.closest('.box-wrapper')
          .find('.nested-panels.collapse:first');

        $timeout(function () {
          $scope.is_nested = collapser.find('.synapp-navigator').length;
        });

        collapser

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
