/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function (angular) {

  angular.module('synapp.router', [])

    .factory('RouterCtrl', require('./factories/Router'));
  
})(angular);
