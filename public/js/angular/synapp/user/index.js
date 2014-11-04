/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp.user', [])

    .factory('UserFactory', require('./factories/User'))

    .directive('synappSign', require('./directives/sign'));
  
})();
