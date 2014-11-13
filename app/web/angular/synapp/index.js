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
    
    .factory('DataFactory', require('./factories/Data'))

    .factory('SignFactory', require('./factories/Sign'))

    .filter('shorten', require('./filters/shorten'))
    
    .filter('calculatePromotionPercentage', function () {
      return function (item) {
        if ( item ) {
          if ( ! item.promotions ) {
            return 0;
          }
          return Math.floor(item.promotions * 100 / item.views);
        }
      }
    })
    
    .filter('getEvaluationItems', ['$rootScope', function ($rootScope) {
      return function (items, item_id) {
        if ( items && item_id ) {
          var evaluation = $rootScope.evaluations
            .reduce(function (evaluation, candidate) {
              if ( candidate.item === item_id ) {
                evaluation = candidate;
              }
              return evaluation;
            }, null);

          if ( evaluation ) {
            return evaluation.items;
          }

          return [];
        }
      };
    }])

    .filter('getFeedbackByItem', [function () {
      return function (feedbacks, item_id) {
        if ( feedbacks ) {
          return feedbacks.filter(function (feedback) {
            return feedback.item === item_id;
          });
        }
      };
    }])

    .filter('filterItems', function () {
      return function (items, type, parent) {
        if ( items ) {

          var query = {};

          if ( type ) {
            query.type = type;
          }

          if ( parent ) {
            query.parent = parent;
          }

          return items.filter(function (item) {
            for ( var field in query ) {
              if ( item[field] !== query [field] ) {
                return false;
              }
            }
            return true;
          });
        }
      };
    })

    .controller('UploadCtrl', require('./controllers/upload'))

    .directive('sign', require('./directives/sign'))

    .directive('item', ['$rootScope', function ($rootScope) {
      return {
        restrict: 'C',
        controller: function ($scope) {

          $scope.loaded = {};

          $scope.$watch('$show', function (show, _show) {
            if ( show && show !== _show ) {
              if ( ! $scope.loaded[show] ) {
                switch ( show ) {
                  case 'children':
                    $scope.loaded.children = true;
                    $scope.$parent.loadChildren($scope.item._id);
                    break;
                }
              }
            }
          });
        }
      };
    }])
    
    .directive('navigator', ['$rootScope', '$compile', 'DataFactory', function ($rootScope, $compile, DataFactory) {
      return {
        restrict: 'C',
        templateUrl: '/templates/navigator',
        scope: {
          type:' @',
          parent: '@'
        },
        controller: function ($scope) {
          
          $scope.loadChildren = function (item_id) {

            var item = $rootScope.items.reduce(function (item, _item) {
              if ( _item._id === item_id ) {
                item = _item;
              }
              return item;
            }, null);

            var scope = $scope.$new();

            compile(item, $('#item-' + item_id), scope, $compile);

            // DataFactory.Item.find({ parent: item_id })
            //   .success(function (items) {
            //     $rootScope.feedbacks = $rootScope.feedbacks.concat(feedbacks);
            //   });
          };
          
        },
        link: function ($scope, $elem, $attrs) {
        }
      };
    }])

    .directive('creator', require('./directives/creator'))

    .directive('evaluator', require('./directives/evaluator'))

    .directive('synappUrlFetcher', require('./directives/url-fetcher'))

    .directive('editor', ['DataFactory', function (DataFactory) {
      return {
        restrict: 'C',
        templateUrl: '/templates/editor',
        controller: function ($scope) {
          $scope.save = function () {
            DataFactory.Item.update($scope.item._id, {
              subject: $scope.item.subject,
              description: $scope.item.description,
              image: (function () {
                if ( Array.isArray($scope.$root.uploadResult) && $scope.$root.uploadResult.length ) {
                    return $scope.$root.uploadResult[0].path.split(/\//).pop();
                  }
              })()
            });
          };
        }
      };
    }])

    .directive('synappItemMedia', require('./directives/item-media'))

    .run(require('./run'));
  
})();

