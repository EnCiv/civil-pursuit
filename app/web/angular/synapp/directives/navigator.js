;(function () {

  module.exports = ['$rootScope', '$compile', 'DataFactory', NavigatorComponent];

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

  function NavigatorComponent ($rootScope, $compile, DataFactory) {
    return {
      restrict: 'C',
      templateUrl: '/templates/navigator',
      scope: {
        type:' @',
        parent: '@'
      },
      controller: ['$scope', function ($scope) {

        $scope.batchSize = synapp['navigator batch size'];

        /** @args {ObjectID} item_id */
        $scope.loadChildren = function (item_id) {

          var item = $rootScope.items.reduce(function (item, _item) {
            if ( _item._id === item_id ) {
              item = _item;
            }
            return item;
          }, null);

          var scope = $scope.$new();

          compile(item, $('#item-' + item_id), scope, $compile);

          DataFactory.Item.find({ parent: item_id })
            .success(function (items) {
              $rootScope.items = $rootScope.items.concat(items);
              /** Lineage */

              items.forEach(function (item) {
                $rootScope.lineage[item._id] = item.parent;
              });
            });
        };

        /** load more items */

        $scope.loadMore = function () {

          var query = { type: $scope.type, $skip: $scope.batchSize };

          if ( $scope.parent ) {
            query.parent = $scope.parent;
          }

          DataFactory.Item.find(query)
            .success(function (items) {
              $rootScope.items = $rootScope.items.concat(items);
              /** Lineage */

              items.forEach(function (item) {
                $rootScope.lineage[item._id] = item.parent;
              });

              $scope.batchSize += synapp['navigator batch size'];
            });
        };
        
      }],
      link: function ($scope, $elem, $attrs) {
        setTimeout(function () {

          var height = $elem.find('.item-text').closest('.box').find('.item-media')
            .height();

          $elem.find('.item-text').each(function () {
            if ( ! $(this).data('dotdotdot') ) {
              $(this).data('dotdotdot', 'yes');

              var elem = $(this);

              $(this).dotdotdot({
                ellipsis: '...',
                wrap: 'word',
                fallBackToLetter: true,
                watch: true,
                tolerance: 0,
                // callback: console.log.bind(console),
                height: height,
                after: "span.readmore"
              });

              $(this).find('span.readmore a').on('click', function () {
                if ( $(this).text() === 'more' ) {
                  $(this).text('less');
                  elem.closest('.box').find('.item-more').removeClass('hide');
                }
                else {
                  $(this).text('more');
                  elem.closest('.box').find('.item-more').addClass('hide');
                }
              })
            }
          });

            
        }, 500);
      }
    };
  }

})();
