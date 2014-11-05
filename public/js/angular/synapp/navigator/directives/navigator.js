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
                  var col1 = $('<div class="col-xs-6"></div>');
                  col1.append(compile(type[0], item));
                  
                  var col2 = $('<div class="col-xs-6"></div>');
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

        /** The accordion
         *
         */
        $elem
          .on('show.bs.collapse', function (event) {
            $('.collapse.in')
              .each(function () {
                if ( ! $(this).has(event.target).length ) {
                  $(this).collapse('hide');
                }
              });
          })
          .on('shown.bs.collapse', function (event) {
            // $(window).scrollTop($elem.offset().top);
            console.log(this.$elem.offset().top)
            /** stop propagation , http://stackoverflow.com/questions/4522257/how-do-stop-events-bubbling-in-jquery */
            return false;
          }.bind({ $elem: $elem }));

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

        var ij = 0;
        Channel.on($scope.from, 'showing', function (message) {

          if ( ! $scope.loaded ) {
            if ( ! ij ) {
              ij ++;
              DataFactory[$scope.type].get($scope.from)
                .success(function (items) {
                  Channel.emit($scope.$id, 'items', items);
                });
            }
          }
        });
      }
    };
  }

})();
