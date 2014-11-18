;(function () {

  module.exports = ['$timeout', SlidersComponent];

  function SlidersComponent ($timeout) {
    return {
      
      restrict: 'C',
      
      templateUrl: '/templates/sliders',

      link: function ($scope, $elem, $attr) {

        $timeout(function () {
          $elem.find('input.slider').slider();

          $elem.find('input.slider').slider('on', 'slideStop',
            function () {
              var slider = $(this);

              if ( slider.attr('type') ) {

                var value = slider.slider('getValue');

                $scope.$parent.evaluation.votes[$scope.item._id][slider.data('criteria')] = value;

              }
            });
        });
      }
    }
  }

})();
