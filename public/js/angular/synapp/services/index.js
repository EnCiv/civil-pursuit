/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  require('../../monson/index');

  angular.module('synapp.services', ['monson'])

    .factory({
      DataFactory: require('./factories/Data'),
      Channel: require('./factories/Channel')
    });
  
})();
