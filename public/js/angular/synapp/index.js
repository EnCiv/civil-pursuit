/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  var synapp = angular.module('synapp', angular_deps);

  /** Filters */

  synapp.filter({
    shortenFilter:                require('./filters/shorten'),
    getCurrentlyEvaluatedFilter:  require('./filters/get-currently-evaluated'),
    getPromotedPercentageFilter:  require('./filters/get-promoted-percentage')
  });

  /** Factories */

  synapp.factory({
    DataFactory:                  require('./factories/Data'),
    UserFactory:                  require('./factories/User')
  });

  /** Controllers */

  synapp.controller({
    UploadCtrl:                   require('./controllers/upload'),
    SignCtrl:                     require('./controllers/sign'),
    NavigatorCtrl:                require('./controllers/navigator'),
    EditorCtrl:                   require('./controllers/editor'),
    EvaluatorCtrl:                require('./controllers/evaluator'),
    DetailsCtrl:                  require('./controllers/details')
  });

  /** Directives */

  synapp.directive({
    synGetUrlTitle:               require('./directives/get-url-title'),
    synSliders:                   require('./directives/sliders'),
    synCharts:                    require('./directives/charts'),
    synMoreLess:                  require('./directives/more-less')
  });
  
})();
