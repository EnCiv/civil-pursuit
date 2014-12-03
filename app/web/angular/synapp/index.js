/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp', ['angularFileUpload', 'ngAnimate', 'autoGrow'])

    .factory({
      DataFactory: require('./factories/Data'),
      SignFactory: require('./factories/Sign'),
      Truncate: require('./factories/Truncate'),
      View: require('./factories/View')
    })

    .filter({
      shorten:                      require('./filters/shorten'),
      calculatePromotionPercentage: require('./filters/calculate-promotion-percentage'),
      getEvaluationItems:           require('./filters/get-evaluation-items'),
      getEvaluationByItem:          require('./filters/get-evaluation-by-item'),
      itemFilter:                   require('./filters/item-filter'),
      criteriaFilter:               require('./filters/criteria-filter'),
      feedbackFilter:               require('./filters/feedback-filter'),
      find:                         require('./filters/find')
    })

    .controller({
      'UploadCtrl': require('./controllers/upload')
    })

    .directive({
      /** Charts */
      charts:        require('./directives/charts'),

      /** Creator */
      creator:        require('./directives/creator'),

      /** Details */
      details:        require('./directives/details'),

      /** Editor */
      editor:         require('./directives/editor'),

      /** Evaluator */
      evaluator:      require('./directives/evaluator'),

      /** Item */
      item:           require('./directives/item'),

      /** Item Media */
      itemMedia:      require('./directives/item-media'),

      /** Panel */
      isPanel:        require('./directives/panel'),

      /** Sign */
      sign:           require('./directives/sign'),

      /** Sliders */
      sliders:        require('./directives/sliders'),

      /** Url Fetcher */
      urlFetcher:     require('./directives/url-fetcher'),
    })

    .run(require('./run'));
  
})();

