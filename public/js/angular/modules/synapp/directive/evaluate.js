// ----- Angular directive $('.synapp-sign') ---------------------------------------------------  //
/*
 *  @abstract Angular directive for all elements with class name "synapp-sign"
 *  @return   Object directive
 *  @param    Object TopicFactory
 */
// ---------------------------------------------------------------------------------------------  //
module.exports = function (EvaluationFactory, CriteriaFactory) { // ----- uses factory/Sign.js ------------------------  //
  return {
    // ---- Restrict directive to class --------------------------------------------------------  //
    restrict: 'C',
    // ---- Link function ----------------------------------------------------------------------  //
    link: function ($scope, $elem, $attrs) {

      $scope.evaluate = {};

      $scope.evaluationDone = false;

      $scope.comparing = [];

      $scope.comparable = [0, 1, 2, 3, 4, 5];

      // Get criterias

      CriteriaFactory.find()

        .error(function (error) {

        })

        .success(function (data) {
          $scope.criterias = data.found;

          console.log($scope.criterias);
        });

      // Get Evaluation

      EvaluationFactory.findById($attrs.id)

        .error(function (error) {

        })

        .success(function (data) {
          
          data.found.entries  = data.found.entries
            .map(function (entry) {
              return entry._id;
            });
            
          $scope.evaluate     = data.found;

          $scope.left         = data.found.entries[0];
          $scope.right        = data.found.entries[1];

          $scope.comparing    = [0, 1];

        });

      //
      $scope.doIt = function ($last) {
        if ( $last ) {
          $("input.slider").slider({
            formatter: function(value) {
              return 'Current value: ' + value;
            }
          });
        }
      };

      // Promote

      $scope.promote = function (entry, position) {
        EvaluationFactory.promote($scope.evaluate._id, entry)
          .success(function (data) {

            var newEntryPosition;

            if ( position === 'left' ) {
              $scope.comparable.splice($scope.comparable.indexOf($scope.comparing[1]), 1);

              newEntryPosition = Math.min.apply(null, 
                $scope.comparable.filter(function (x) {
                  return x !== $scope.comparing[0];
                }));

              if ( newEntryPosition === Number.POSITIVE_INFINITY ) {
                $scope.evaluationDone = true;
                return;
              }

              $scope.comparing[1] = newEntryPosition;

              $scope.right = $scope.evaluate.entries[newEntryPosition];
            }

            else if ( position === 'right' ) {
              $scope.comparable.splice($scope.comparable.indexOf($scope.comparing[0]), 1);

              newEntryPosition = Math.min.apply(null, 
                $scope.comparable.filter(function (x) {
                  return x !== $scope.comparing[1];
                }));

              if ( newEntryPosition === Number.POSITIVE_INFINITY ) {
                $scope.evaluationDone = true;
                return;
              }

              $scope.comparing[0] = newEntryPosition;

              $scope.left = $scope.evaluate.entries[newEntryPosition];
            }
            
          });
      };

      // Continue

      $scope.continue = function () {
        $scope.comparable = $scope.comparable.filter(function (num) {
          return num > Math.max.apply(null, $scope.comparing);
        });

        if ( ! $scope.comparable.length ) {
          $scope.evaluationDone = true;
          return console.warn('end');
        }

        $scope.comparing  = [$scope.comparable[0], $scope.comparable[1]];

        $scope.left       = $scope.evaluate.entries[$scope.comparing[0]];
        $scope.right      = $scope.evaluate.entries[$scope.comparing[1]];
      };
    }
  };
};