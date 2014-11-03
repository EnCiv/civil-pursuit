/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp.editor', ['angularFileUpload', 'autoGrow', 'synapp.filters', 'synapp.services'])

    .directive('synappEditor',      require('./directives/editor'))
    .directive('synappUrlFetcher',  require('./directives/url-fetcher'))

    .controller('UploadCtrl',   require('./controllers/upload'));
  
})();
