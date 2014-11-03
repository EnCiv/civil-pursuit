;(function () {

  function NavigatorComponent ($rootScope, $timeout, $compile, DataFactory) {

    var on, emit;

    return {
      restrict:       'C',
      scope:          {
        type: '@',
        from: '@'
      },
      templateUrl:    '/templates/navigator',
      replace:        false,
      controller:     function ($scope) {

        on = function (event, callback) {
          $rootScope.$on($scope.$id + ' ' + event, callback)
        }

        emit = function (event, message) {
          $scope.$emit($scope.$id + ' ' + event, message);
        }

        function getItem () {
          // GET TOPICS

          DataFactory[$scope.type].get($scope.from)
            .success(function (items) {

              $scope.items = items;

              if ( items.length ) {
                emit('got items of type ' + items[0].type, items);
              }
            });
        }

        // GET ITEMS

        getItem();

        // UPDATE ITEMS

        on('created item', function (event, item) {
          $scope.items.push(item);
        });
      },
      
      link: function ($scope, $elem, $attr) {

        // Plus icon behavior to toggle editor's visibility

        function toggle_editor_view () {
          $elem.find('.fa-plus').on('click', function () {
            $(this).closest('.panel').find('.synapp-editor').collapse('toggle');
          });
        }

        toggle_editor_view();        

        // Compile nested panels directive

        function compileDirective (type, item) {
          var tpl = '<div data-type="' + type + '" data-from=":from:" class="synapp-navigator"></div>';
          return $compile(tpl.replace(/:from:/, item._id))($scope);
        }

        on('got items of type ' + $scope.type, function (event, items) {
          $timeout(function () {

            var has = synapp['item relation'][$scope.type];

            if ( has ) {
              items.forEach(function (item, i) {

                var target = $elem.find('.nested-panels:eq(' + i + ')');
                var row = $('<div class="row"></div>');

                target.empty();

                if ( Array.isArray( has ) ) {
                  has.forEach(function (type) {

                    if ( Array.isArray( type ) ) {
                      
                      var col1 = $('<div class="col-xs-6"></div>');
                      col1.append(compileDirective(type[0], item));
                      
                      var col2 = $('<div class="col-xs-6"></div>');
                      col2.append(compileDirective(type[1], item));
                      
                      row.append(col1, col2);
                      target.append(row);
                    }
                    else {
                      target.append(compileDirective(type, item));
                    }
                  });
                }

                else {
                  target.append(compileDirective(has, item));
                }
              });
            }
          });
        });

        // Function to toggle show/hide elements

        $scope.toggle = function (what, $event) {

          
          $($event.target).closest('.box-wrapper').find('.synapp-' + what + ':eq(0)').collapse('toggle');
        }

        function onExpand ($event) {
          console.log('Hey! I am expanding');

          $('.collapse.in')

            .each(function () {
              if ( ! $(this).has($event.target).length ) {
                $(this).collapse('hide');
              }
            });
        }

        function onExpanded ($event) {
          console.log('Hey! I have expend');
          
        }

        function onCollapse ($event) {
          console.log('Hey! I am collapsing');
        }

        function onCollapsed ($event) {
          console.log('Hey! I have collapsed');
        }

        $elem
          .on('show.bs.collapse', onExpand)
          .on('shown.bs.collapse', onExpanded)
          .on('hide.bs.collapse', onCollapse)
          .on('hidden.bs.collapse', onCollapsed);

        $rootScope.$on('go to', function (event, route) {
          console.log('got go to', route);
        });
      }
    };
  }

  module.exports = ['$rootScope', '$timeout', '$compile', 'DataFactory', NavigatorComponent];

})();
