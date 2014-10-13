/**
 * `sliders` Manage sliders
 * 
 * @module synapp
 * @function directive::sliders
 * @return {AngularDirective}
 * @example
 *    <ANY data-syn-sliders>
 *      <INPUT
 *        class="slider"
 *        type="text"
 *        data-item="{{item}}"
 *        data-criteria="{{criteria}}"
 *        data-ng-model="item.$votes[criteria._id]"
 *        />
 *    </ANY>
 * @author francoisrvespa@gmail.com
*/

module.exports = function () {
  return {
    restrict: 'CA',

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

              var item = $scope.$parent.items
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
  };
};
