/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp', ['angularFileUpload'])

    .factory({
      DataFactory: require('./factories/Data'),
      SignFactory: require('./factories/Sign')
    })

    .filter({
      shorten:                      require('./filters/shorten'),
      calculatePromotionPercentage: require('./filters/calculate-promotion-percentage'),
      getEvaluationItems:           require('./filters/get-evaluation-items'),
      getFeedbacksByItem:           require('./filters/get-feedbacks-by-item'),
      filterItems:                  require('./filters/filter-items')
    })

    .controller({
      'UploadCtrl': require('./controllers/upload')
    })

    .directive({
      sign:           require('./directives/sign'),
      item:           require('./directives/item'),
      navigator:      require('./directives/navigator'),
      creator:        require('./directives/creator'),
      evaluator:      require('./directives/evaluator'),
      urlFetcher:     require('./directives/url-fetcher'),
      editor:         require('./directives/editor'),
      itemMedia:      require('./directives/item-media')
    })

    .run(require('./run'));
  
})();

