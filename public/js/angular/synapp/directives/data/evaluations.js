module.exports = function (EvaluationFactory) {
  return {
    restrict: 'C',

    link: function ($scope, $elem, $attr) {
      // find evaluation

      if ( $attr.evaluation ) {
        EvaluationFactory.findById($attr.evaluation)

          .success(function (evaluation) {

            // For each entry

            evaluation.entries = evaluation.entries
              .map(function (entry) {

                // Format entry

                entry = entry.entry;

                // Update votes in scope

                $scope.votes[entry._id] = {};


                // Return formatted entry

                return entry;
              });

            /*if ( evaluation.entries.length < 2 ) {
              $scope.comparing = [];

              for ( var i = 0, len = evaluation.entries.length; i < len; i ++ ) {
                $scope.comparing.push(i);
              }
            }*/

            $scope.evaluation = evaluation;
          });
      }

    }
  };
};