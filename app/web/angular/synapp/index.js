/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp', ['angularFileUpload', 'ngAnimate'])

    .factory({
      DataFactory: require('./factories/Data'),
      SignFactory: require('./factories/Sign')
    })

    .filter({
      shorten:                      require('./filters/shorten'),
      calculatePromotionPercentage: require('./filters/calculate-promotion-percentage'),
      getEvaluationItems:           require('./filters/get-evaluation-items'),
      getEvaluationByItem:          require('./filters/get-evaluation-by-item'),
      getFeedbacksByItem:           require('./filters/get-feedbacks-by-item'),
      filterItems:                  require('./filters/filter-items'),
      criteriaFilter:               function () {
        return function (criterias, criteria) {
          if ( criterias ) {
            return criterias.filter(function (_criteria) {
              for ( var key in criteria ) {
                if ( _criteria[key] !== criteria[key] ) {
                  return false;
                }
              }
              return true;
            });
          }
        };
      }
    })

    .controller({
      'UploadCtrl': require('./controllers/upload')
    })

    .directive({
      sign:           require('./directives/sign'),
      
      /** Navigator */
      navigator:      require('./directives/navigator'),

      /** Item */
      item:           require('./directives/item'),
      
      /** Creator */
      creator:        require('./directives/creator'),

      /** Evaluator */
      evaluator:      require('./directives/evaluator'),

      /** Url Fetcher */
      urlFetcher:     require('./directives/url-fetcher'),

      /** Editor */
      editor:         require('./directives/editor'),

      /** Item Media */
      itemMedia:      require('./directives/item-media'),

      /** Sliders */
      sliders:        require('./directives/sliders')
    })

    .config(['$locationProvider',
      function ($locationProvider) {
        // $locationProvider.html5Mode(false);
      }])

    .run(require('./run'));
  
})();

