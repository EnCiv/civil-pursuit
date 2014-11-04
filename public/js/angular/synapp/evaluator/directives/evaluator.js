module.exports = ['DataFactory', function (DataFactory) {
	return {
		restrict: 'C',
		templateUrl: '/templates/evaluator',
    scope: {
      itemId: '@',
      limit: '@'
    },
    
    controller: function ($scope) {

      // console.log('EVALUATOR', {
      //   itemId: $scope.itemId,
      //   limit: $scope.limit,
      //   id: $scope.$id
      // });

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

      var change = function () {
        // if left has a feedback -- save it

        // if ( $scope.items[0].$feedback ) {
        //   DataFactory.Feedback.create($scope.items[0]._id, $scope.items[0].$feedback);
        // }

        // if right has a feedback -- save it

        // if ( $scope.items[1] && $scope.items[1].$feedback ) {
        //   DataFactory.Feedback.create($scope.items[1]._id, $scope.items[1].$feedback);
        // }

        // // votes

        // var votes = [];

        // // if left has votes

        // if ( $scope.items[0].$votes ) {
        
        //   for ( var criteria in $scope.items[0].$votes ) {
        //     votes.push({
        //       criteria: criteria,
        //       item: $scope.items[0]._id,
        //       value: $scope.items[0].$votes[criteria]
        //     })
        //   }
        // }

        // // if right has votes

        // if ( $scope.items[1] && $scope.items[1].$votes ) {
        
        //   for ( var criteria in $scope.items[1].$votes ) {
        //     votes.push({
        //       criteria: criteria,
        //       item: $scope.items[1]._id,
        //       value: $scope.items[1].$votes[criteria]
        //     })
        //   }
        // }

        // // save votes

        // if ( votes.length ) {
        //   DataFactory.model('Vote').post(votes);
        // }
      };

      /** @method promote 
       *  @param index {number} - 0 for left, 1 for right
       */

      $scope.promote = function (index) {

        change();

        // Promoting left item

        if ( index === 0 ) {

          // Increment promotions counter

          Item.set($scope.current[0]._id, { $inc: { promotions: 1 } });

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

          Item.set($scope.items[1]._id, { $inc: { promotions: 1 } });

          // finish if last

          if ( ! $scope.items[2] ) {
            return $scope.finish();
          }

          // remove unpromoted from DOM

          $scope.items[0] = $scope.items.splice(2, 1)[0];

          onChange();
        }

        // update cursor
        $scope.evaluator.cursor ++;
      };
    },
    
    link: function ($scope, $elem, $attr) {

      $scope.state = 0;

      $elem
        .on('show.bs.collapse', function () {

          if ( ! $scope.state ) {
            $scope.state = 1;

            DataFactory.Item.evaluate($scope.itemId)
              .success(function (evaluation) {

                $scope.state = 2;

                $scope.evaluation = evaluation;

                $scope.current = [];
                $scope.next = [];

                if ( evaluation.items.length) {
                  $scope.current.push(evaluation.items[0]);

                  if ( evaluation.items[1] ) {
                    $scope.current.push(evaluation.items[1]);
                  }

                  if ( evaluation.items[2] ) {
                    $scope.next.push(evaluation.items[2]);
                  }

                  if ( evaluation.items[3] ) {
                    $scope.next.push(evaluation.items[3]);
                  }
                }

                if ( evaluation.items.length < 6 ) {
                  $scope.limit = evaluation.items.length - 1;

                  if ( ! $scope.limit && evaluation.items.length === 1 ) {
                    $scope.limit = 1;
                  }
                }
                
              });
          }
        });
    }
	};
}];
