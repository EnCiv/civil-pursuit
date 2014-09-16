module.exports = function () {
  return {
    restrict: 'C',

    link: function ($scope, $elem, $attr) {

      $scope.enableSlider = function ($last) {

        if ( $last ) {

          // Tooltip

          $("input.slider").slider({
            formatter: function(value) {
              return 'Current value: ' + value;
            }
          });

          // On slide stop, update scope
          
          $("input.slider").slider('on', 'slideStop', function () {
            if ( $(this).attr('type') ) {

              $scope.votes[$(this).data('entry')][$(this).data('criteria')] =
                $(this).slider('getValue');

              $scope.$apply();

              console.log('votes updated', $scope.votes);
            }
          });
        }
      };
    }
  };
};