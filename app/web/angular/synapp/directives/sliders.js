;(function () {

  module.exports = ['$rootScope', SlidersComponent];

  function SlidersComponent ($rootScope) {
    return {
      
      restrict: 'C',
      
      templateUrl: '/templates/sliders',

      link: function ($scope, $elem, $attr) {

        $scope.enableSlider = function ($last, current) {

          if ( $last ) {

            // Tooltip

            $("input.slider").slider();

            // Set value

            $('input.slider')
              .slider('setValue', 5);

            current = 5;

            // On slide stop, update scope
            
            $("input.slider").slider('on', 'slideStop', function () {

              var slider = $(this);

              if ( slider.attr('type') ) {

                var item = $rootScope.items
                  .reduce(function (item, _item) {
                    if ( _item._id === slider.data('item') ) {
                      item = _item;
                    }
                    return item;
                  }, {});

                if ( ! item.$votes ) {
                  item.$votes = {};
                }

                item.$votes[slider.data('criteria')] = slider.slider('getValue');
              }
            });
          }
        };
      }
    }
  }

})();