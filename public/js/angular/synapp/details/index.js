/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp.details', ['synapp.services'])

	.directive('synappDetails', require('./directives/details'));
  
})();
