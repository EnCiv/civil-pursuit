/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  require('./services/index');
  require('./filters/index');
  require('./router/index');
  require('./cloudinary/index');
  require('./navigator/index');
  require('./editor/index');
  require('./evaluator/index');
  require('./details/index');
  require('./user/index');

  angular.module('synapp', [
    'synapp.user',
  	'synapp.router',
    'synapp.navigator',
    'synapp.editor',
    'synapp.evaluator',
    'synapp.details'
  ]);
  
})();
