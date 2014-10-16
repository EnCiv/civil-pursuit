/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  require('../monson/index');

  angular_deps.push('monson');

  var synapp = angular.module('synapp', angular_deps);

  /** Filters */

  synapp.filter({
    shortenFilter:                    [require('./filters/shorten')],
    fromNowFilter:                    [require('./filters/from-now')],
    getCurrentlyEvaluatedFilter:      [require('./filters/get-currently-evaluated')],
    getPromotedPercentageFilter:      [require('./filters/get-promoted-percentage')],
    cloudinaryTransformationFilter:   [require('./filters/cloudinary-transformation')]
  });

  /** Factories */

  synapp.factory({
    DataFactory:                  ['MonsonFactory', require('./factories/Data')],
    UserFactory:                  ['$http', require('./factories/User')]
  });

  /** Controllers */

  synapp.controller({
    UploadCtrl:                   ['$scope', '$http', '$timeout', '$upload', require('./controllers/upload')],
    SignCtrl:                     ['$scope', 'UserFactory', require('./controllers/sign')],
    NavigatorCtrl:                ['$scope', 'DataFactory', '$timeout', require('./controllers/navigator')],
    EditorCtrl:                   ['$scope', 'DataFactory', '$timeout', require('./controllers/editor')],
    EvaluatorCtrl:                ['$scope', 'DataFactory', '$timeout', require('./controllers/evaluator')],
    DetailsCtrl:                  ['$scope', 'DataFactory', '$timeout', require('./controllers/details')]
  });

  /** Directives */

  synapp.directive({
    synGetUrlTitle:               ['$http', require('./directives/get-url-title')],
    synSliders:                   [require('./directives/sliders')],
    synCharts:                    ['$timeout', require('./directives/charts')],
    synMoreLess:                  [require('./directives/more-less')]
  });

  /** Run **/

  synapp.run([function () {
    $('.sy-ng-elem').css('visibility', 'visible');
  }]);
  
})();
