module.exports = ['DataFactory', function (DataFactory) {

  var change, one = 0, two = 1;

	return {
		restrict: 'C',
		templateUrl: '/templates/evaluator',
    scope: {
      itemId: '@',
      limit: '@'
    },
    
    controller: function ($scope) {

      $scope.cursor = 1;

      /** @method onChange */

      function onChange () {

        // Add views counter

        if ( $scope.current[0] ) {
          console.info('Adding view to left item', $scope.current[0].subject)
          $scope.addView($scope.current[0]);
        }

        if ( $scope.current[1] ) {
          console.info('Adding view to right item', $scope.current[1].subject)
          $scope.addView($scope.current[1]);
        }
      }

      /** @method addView 
       *  @param item {ItemSchema}
       */

      $scope.addView = function (item) {
        DataFactory.Item.set(item._id, { $inc: { views: 1 } });
      };

      /** @method change */

      change = function (which) {
        which = which || 'both';

        if ( which === 'left' || which === 'both' ) {
          if ( ! $scope.items[one] ) {
            return console.warn('No items with index', one);
          }
          
          $scope.current[0] = $scope.items[one];

          $scope.addView($scope.items[one]);
        }

        if ( which === 'right' || which === 'both' ) {
          if ( ! $scope.items[two] ) {
            return console.warn('No items with index', two);
          }
          $scope.current[1] = $scope.items[two];
        }
      }

      

      /** @method promote 
       *  @param index {number} - 0 for left, 1 for right
       */

      $scope.promote = function (index) {

        // Promoting left item

        if ( index === 0 ) {

          // Increment promotions counter

          DataFactory.Item.set($scope.current[0]._id, { $inc: { promotions: 1 } })
            .success(function () {
              // $rootScope.$emit('changed item');
            });

          // finish if last

          if ( ! $scope.next.length ) {
            return $scope.finish();
          }

          // remove unpromoted from DOM

          $scope.current[1] = $scope.next.shift();

          onChange();
        }

        // Promoting right item

        else {

          // Increment promotions counter

          DataFactory.Item.set($scope.current[1]._id, { $inc: { promotions: 1 } })
            .success(function () {
              $rootScope.$emit('changed item');
            });

          // finish if last

          if ( ! $scope.items[2] ) {
            return $scope.finish();
          }

          // remove unpromoted from DOM

          //$scope.items[0] = $scope.items.splice(2, 1)[0];
        }
      };
    },
    
    link: function ($scope, $elem, $attr) {

      $scope.state = 0;

      $scope.finish = function () {
        $elem.collapse('hide');
        $scope.state = 0;
      }

      function onGotEvaluation (evaluation) {
        $scope.state = 2;

        $scope.evaluation = evaluation;

        $scope.criterias = evaluation.criterias;

        $scope.items = evaluation.items;

        $scope.current = [];
        $scope.next = [];

        if ( evaluation.items.length < 6 ) {
          $scope.limit = evaluation.items.length - 1;

          if ( ! $scope.limit && evaluation.items.length === 1 ) {
            $scope.limit = 1;
          }
        }

        if ( evaluation.items.length ) {
          if ( evaluation.items[0] ) {
            $scope.current[0] = evaluation.items[0];
            $scope.addView(evaluation.items[0]);
          }

          if ( evaluation.items[1] ) {
            $scope.current[1] = evaluation.items[1];
            $scope.addView(evaluation.items[1]);
          }

          if ( evaluation.items[2] ) {
            $scope.next[0] = evaluation.items[2];
          }

          if ( evaluation.items[3] ) {
            $scope.next[1] = evaluation.items[3];
          }
        }
      }

      $elem
        .on('show.bs.collapse', function () {

          if ( ! $scope.state ) {
            $scope.state = 1;

            DataFactory.Item.evaluate($scope.itemId)
              .success(onGotEvaluation);
          }
        });
    }
	};
}];
