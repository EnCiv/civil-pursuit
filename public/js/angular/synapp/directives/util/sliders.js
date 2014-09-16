module.exports = function () {
  return {
    restrict: 'C',

    link: function ($scope, $elem, $attr) {

      $scope.enableSlider = function ($last, current) {

        if ( $last ) {

          // Tooltip

          $("input.slider").slider({
            formatter: function(value) {
              return 'Current value: ' + value;
            }
          });

          // Set value

          $('input.slider')
            .slider('setValue', 5);

          current = 5;

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