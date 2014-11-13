/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  function compile (item, into, scope, $compile) {

    function _compile (type) {

      var tpl = '<div ' +
        ' data-type    =   "' + type + '" ' +
        ' data-parent  =   "' + item._id + '"' +
        ' class        =   "navigator"></div>';

      return $compile(tpl)(scope);
    }

    var has = synapp['item relation'][item.type];

    console.log(has);

    if ( has ) {
      var row = $('<div class="row"></div>'),
        target = into.find('.children');

      if ( Array.isArray( has ) ) {
        has.forEach(function (type) {

          if ( Array.isArray( type ) ) {
            var col1 = $('<div class="col-xs-6 split-view"></div>');
            col1.append(_compile(type[0]));
            
            var col2 = $('<div class="col-xs-6 split-view"></div>');
            col2.append(_compile(type[1]));
            
            row.append(col1, col2);
            target.append(row);
          }

          else {
            target.append(_compile(type));
          }
        });
      }

      else {
        target.append(_compile(has));
      }
    }

    return true;
  }

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
    //   creator:        require('./directives/creator'),
    //   evaluator:      require('./directives/evaluator'),
    //   urlFetcher:     require('./directives/url-fetcher'),
    //   editor:         require('./directives/editor'),
    //   itemMedia:      require('./directives/item-media')
    })

    .run(require('./run'));
  
})();

