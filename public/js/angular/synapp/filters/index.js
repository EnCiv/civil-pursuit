/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp.filters', [])

    .filter({
      shortenFilter:    [require('./filters/shorten')]
    });
  
})();
  