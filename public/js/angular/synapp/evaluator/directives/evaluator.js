module.exports = ['DataFactory', 'Channel', function (DataFactory, Channel) {

  var change, one = 0, two = 1;

	return {
		restrict: 'C',
		templateUrl: '/templates/evaluator',
    scope: {
      itemId: '@',
      limit: '@',
      from: '@'
    },
    
    controller: function ($scope) {

      $scope.cursor = 1;

      console.log($scope)

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

          onChange();

          // remove unpromoted from DOM

          $scope.change('right');

          // finish if last

          if ( ! $scope.next.length ) {
            return $scope.finish();
          }

          
        }

        // Promoting right item

        else {
          // Increment promotions counter

          DataFactory.Item.set($scope.current[1]._id, { $inc: { promotions: 1 } })
            .success(function () {
              // $rootScope.$emit('changed item');
            });

          onChange();

          // remove unpromoted from DOM

          $scope.change('left');

          // finish if last

          if ( ! $scope.next.length ) {
            return $scope.finish();
          }
        }
      };
    },
    
    link: function ($scope, $elem, $attr) {

      $scope.state = 0;

      $scope.finish = function () {
        $elem.collapse('hide');
        $scope.state = 0;
      };

      $scope.continue = function () {
        $scope.change();
      }

      /** @method change */

      $scope.change = function (d) {

        console.log('change', $scope)

        d = d || 'both';

        if ( d === 'left' || d === 'both' ) {
          $scope.current[0] = $scope.next.shift();
        }

        if ( d === 'right' || d === 'both' ) {
          $scope.current[1] = $scope.next.shift();
        }

        if ( d === 'both' ) {
          $scope.next.push($scope.items.shift());
          $scope.cursor ++;
        }

        $scope.cursor ++;

        $scope.next.push($scope.items.shift());
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

        start();
      }

      function start () {
        var series = [
          function () { $scope.current[0] = $scope.items.shift(); },
          function () { $scope.current[1] = $scope.items.shift(); },
          function () { $scope.next[0]    = $scope.items.shift(); },
          function () { $scope.next[1]    = $scope.items.shift(); },
        ];

        var i = 0;

        while ( series[i] && $scope.items.length ) {
          series[i]();
          i++;
        }
      }

      Channel
        .on($scope.itemId, 'promoting', function () {

          if ( ! $scope.state ) {
            $scope.state = 1;

            DataFactory.Item.evaluate($scope.itemId)
              .success(onGotEvaluation);
          }
        });
    }
	};
}];
