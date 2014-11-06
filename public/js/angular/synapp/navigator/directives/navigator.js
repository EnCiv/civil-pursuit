;(function () {
  module.exports = ['$rootScope', '$timeout', '$compile', 'DataFactory', 'Channel', NavigatorComponent];

  function NavigatorComponent ($rootScope, $timeout, $compile, DataFactory, Channel) {

    return {
      
      restrict:       'C',
      
      scope:          {
        type: '@',
        from: '@',
        autoload: '@'
      },
      
      templateUrl:    '/templates/navigator',
      
      controller:     function ($scope) {

        // console.info('NAVIGATOR', {
        //   type: $scope.type,
        //   from: $scope.from,
        //   autoload: $scope.autoload,
        //   id: $scope.$id,
        //   parent: $scope.$parent.$id
        // });

        /** Items from back-end
         *
         */
        $scope.items = [];

        /** How many times items have been fecthed from back-end
         *
         */
        $scope.loaded = 0;
        $scope.opened = false;
        $scope.$watch('opened', function (from, _from) {
          if ( typeof from === 'string' && from !== _from ) {
            Channel.emit(from, 'showing');
          }
        });
        $scope.promote_enable = false;
        $scope.$watch('promote_enable', function (from, _from) {
          if ( typeof from === 'string' && from !== _from ) {
            console.log('/7/', from)
            Channel.emit(from, 'promoting');
          }
        });

        /** How many items in a batch
         *
         */
        $scope.batch = synapp['navigator batch size'];

        /** Autoloading items
         *
         */
        if ( $scope.autoload ) {
          DataFactory[$scope.type].get($scope.from)
            .success(function (items) {
              Channel.emit($scope.$id, 'items', items);
            });
        }

        
      },
      
      link: function ($scope, $elem, $attr) {

        $scope.panel = {
          $active: $scope.$id, 
          $view: {
            panel: true
          }
        };

        /** The accordion
         *
         */
        $scope.toggle = function (component, id) {
          $scope.panel.$view[component] = ! $scope.panel.$view[component];
          if ( id ) {
            $scope.panel.$active = id;
          }
          console.log($scope.panel.$view[component])
        };

        $scope.loadMore = function () {

          var query = { type: $scope.type };

          if ( $scope.from ) {
            query.from = $scope.from;
          }

          DataFactory.model('Item')
            .offset(synapp['navigator batch size'] * $scope.loaded)
            .limit(synapp['navigator batch size'])
            .sort('promotions', 1)
            .sort('created', 1)
            .addQuery(query)
            .get()
            .success(function (items) {
              Channel.emit($scope.$id, 'items', items);
            });
        }

        function Compile (item, index) {

          function compile (type, item) {

            var tpl = '<div ' +
              ' data-type    =   "' + type + '" ' +
              ' data-from    =   "' + item._id + '"' +
              ' class        =   "synapp-navigator"></div>';

            return $compile(tpl)($scope);
          }

          var has = synapp['item relation'][$scope.type];

          if ( has ) {
            var target = $elem.find('.nested-panels:eq(' + index + ')');
            var row = $('<div class="row"></div>');

            target.empty();

            if ( Array.isArray( has ) ) {
              has.forEach(function (type) {

                if ( Array.isArray( type ) ) {
                  var col1 = $('<div class="col-xs-6 split-view"></div>');
                  col1.append(compile(type[0], item));
                  
                  var col2 = $('<div class="col-xs-6 split-view"></div>');
                  col2.append(compile(type[1], item));
                  
                  row.append(col1, col2);
                  target.append(row);
                }

                else {
                  target.append(compile(type, item));
                }
              });
            }

            else {
              target.append(compile(has, item));
            }
          }

          return true;
        }

        /** What to do on new items
         *
         */
        Channel.on($scope.$id, 'items', function (items) {
          $scope.loaded ++;
          
          $scope.items = $scope.items.concat(items);
          
          $timeout(function () {
            $scope.items = $scope.items.map(function (item, i) {
              if ( typeof item.$compiled === 'undefined' ) {
                item.compiled = new Compile(item, i);
              }
              return item;
            });
          });
        });

        /** What to do on toggle arrow (show/hide)
         *
         */

        Channel.on($scope.from, 'showing', function (message) {
          if ( ! $scope.loaded ) {
            $timeout(function () {
              DataFactory[$scope.type].get($scope.from)
                .success(function (items) {
                  Channel.emit($scope.$id, 'items', items);
                });
              }, 1000);
          }
        });
      }
    };
  }

})();
