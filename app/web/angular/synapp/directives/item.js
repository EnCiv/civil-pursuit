;(function () {

  function isVisible (elem) {

    var parent = { elem: elem.parent() };

    parent.top = parent.elem.offset().top;

    parent.height = parent.elem.outerHeight();

    var child = { elem: elem };

    child.top = elem.offset().top;

    return (parent.top + parent.height) > child.top;
  }

  function compile (item, into, scope, $compile) {

    function _compile (type) {

      var tpl = '<div ' +
        ' data-type    =   "' + type + '" ' +
        ' data-parent  =   "' + item._id + '"' +
        ' class        =   "is-panel"></div>';

      return $compile(tpl)(scope);
    }

    var has = synapp['item relation'][item.type];

    if ( has ) {
      var row = $('<div class="row"></div>'),
        target = into.find('.children .is-section');

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

  module.exports = ['$rootScope', '$compile', '$timeout', 'DataFactory', 'Truncate', Item];

  function Item ($rootScope, $compile, $timeout, DataFactory, Truncate) {
    return {
      restrict: 'C',
      controller: ['$scope', function ($scope) {

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

        /** Listen to load children event **/
        $scope.$root.subscribe('load children', function (message) {
          if ( message.parent === $scope.item._id ) {
            $scope.loadChildren(message.parent);
            message.view.removeClass('is-loading').addClass('is-loaded');
          }
        });

      }],
      link: function ($scope, $elem, $attr) {
        $scope.isSplit = ['Agree', 'Disagree', 'Pro', 'Con']
          .indexOf($scope.item.type) > -1;

        $timeout(function () {
          new Truncate($elem);
        });
      }
    };
  }
})();
