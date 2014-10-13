/**
 * `EvaluatorCtrl` Evaluator
 * 
 * @module controllers/evaluator
 * @prop evaluator {Object} - Evaluator settings
 * @prop evaluator.cursor {number} - Item-to-item cursor
 * @prop evaluator.limit {number} - max item-to-item screens
 * @example
 *    <ANY ng-controller="EvaluatorCtrl" />
 * @author francoisrvespa@gmail.com
*/

module.exports = function EvaluatorCtrl ($scope, DataFactory, $timeout) {
      
  var Item = DataFactory.Item;

  $scope.evaluator  = {
    cursor: 1,
    limit: 5
  };

  /** @method onChange */

  function onChange () {

    // Add views counter

    if ( $scope.items[0] ) {
      console.info('Adding view to left item', $scope.items[0].subject)
      $scope.addView($scope.items[0]);
    }

    if ( $scope.items[1] ) {
      console.info('Adding view to right item', $scope.items[1].subject)
      $scope.addView($scope.items[1]);
    }
  }

  // fetch evaluation
  $timeout(function () {
    return Item.evaluate($scope.item)
      
      .ok(function (evaluation) {
        console.log(evaluation)
        
        $scope.items = evaluation.items;

        if ( $scope.items.length < 6 ) {
          $scope.evaluator.limit = $scope.items.length - 1;

          if ( ! $scope.evaluator.limit && $scope.items.length === 1 ) {
            $scope.evaluator.limit = 1;
          }
        }

        $scope.criterias = evaluation.criterias;
        
        onChange();
      });
  });

  /** @method addView 
   *  @param item {ItemSchema}
   */

  $scope.addView = function (item) {
    Item.set(item._id, { $inc: { views: 1 } });
  };

  /** @method change */

  var change = function () {
    // if left has a feedback -- save it

    if ( $scope.items[0].$feedback ) {
      DataFactory.Feedback.create($scope.items[0]._id, $scope.items[0].$feedback);
    }

    // if right has a feedback -- save it

    if ( $scope.items[1] && $scope.items[1].$feedback ) {
      DataFactory.Feedback.create($scope.items[1]._id, $scope.items[1].$feedback);
    }

    // votes

    var votes = [];

    // if left has votes

    if ( $scope.items[0].$votes ) {
    
      for ( var criteria in $scope.items[0].$votes ) {
        votes.push({
          criteria: criteria,
          item: $scope.items[0]._id,
          value: $scope.items[0].$votes[criteria]
        })
      }
    }

    // if right has votes

    if ( $scope.items[1] && $scope.items[1].$votes ) {
    
      for ( var criteria in $scope.items[1].$votes ) {
        votes.push({
          criteria: criteria,
          item: $scope.items[1]._id,
          value: $scope.items[1].$votes[criteria]
        })
      }
    }

    // save votes

    if ( votes.length ) {
      DataFactory.model('Vote').post(votes);
    }
  };

  /** @method promote 
   *  @param index {number} - 0 for left, 1 for right
   */

  $scope.promote = function (index) {

    change();

    // Promoting left item

    if ( index === 0 ) {

      // Increment promotions counter

      Item.set($scope.items[0]._id, { $inc: { promotions: 1 } });

      // finish if last

      if ( ! $scope.items[2] ) {
        return $scope.finish();
      }

      // remove unpromoted from DOM

      $scope.items.splice(1, 1).length

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

  // continue

  $scope.continue = function () {

    change();

    // remove current entries from DOM
    $scope.items.splice(0, $scope.items[1] ? 2 : 1);

    // update cursor
    $scope.evaluator.cursor += 2;

    // when there are 3 items
    if ( $scope.evaluator.cursor > $scope.evaluator.limit && ($scope.evaluator.limit === 2 || $scope.evaluator.limit === 4) ) {
      $scope.evaluator.cursor = $scope.evaluator.limit;
    }

    onChange();

    // scroll back to top
    $(document).scrollTop(0);
  };

  // finish
  $scope.finish = function () {
    change();

    if ( $scope.item ) {
      location.href = '/details/' + $scope.item;
    }
  };

  // update user evaluation
  $scope.updateUserEvaluation = function () {

  };
};
