/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp.navigator', ['synapp.services', 'synapp.cloudinary'])

    .filter({
      getPromotedPercentageFilter:  [require('./filters/get-promoted-percentage')],
    })

    .directive('synappNavigator', require('./directives/navigator'))

    .directive('synappItemMedia', require('./directives/item-media'))

    .directive('synappMoreLess', require('./directives/more-less'))

    .directive('synappToggleArrow', require('./directives/toggle-arrow'));
  
})();
