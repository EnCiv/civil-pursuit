// .synapp-evaluate

module.exports = function (EvaluationFactory, CriteriaFactory, VoteFactory, SignFactory, EntryFactory) {
  return {
    
    // Restrict to class

    restrict: 'C',
    
    link: function ($scope, $elem, $attrs) {

      $scope.criterias      = [];

      $scope.evaluate       = {};

      $scope.evaluationDone = false;

      $scope.comparing      = [];

      $scope.comparable     = [0, 1, 2, 3, 4, 5];

      $scope.votes          = {};

      $scope.getFlow        = [0, 2];

      // Get criterias

      $scope.getCriterias   = function (cb) {
        CriteriaFactory.find()

          .success(function (criterias) {
            $scope.criterias = criterias;

            cb();
          });
      };

      // Get Evaluation

      $scope.getEvaluation = function (cb) {

        EvaluationFactory.findById($attrs.id)

          .success(function (evaluation) {

            evaluation.entries  = evaluation.entries
              .map(function (entry) {
                $scope.votes[entry._id._id] = {};

                EntryFactory.view(entry._id._id);

                return entry._id;
              });
              
            $scope.evaluate     = evaluation;

            $scope.left         = evaluation.entries[0];
            $scope.right        = evaluation.entries[1];

            $scope.comparing    = [0, 1];

            cb();

          });
      };

      //
      $scope.enableSlider = function ($last) {
        if ( $last ) {
          $("input.slider").slider({
            formatter: function(value) {
              return 'Current value: ' + value;
            }
          });
          $("input.slider").slider('on', 'slideStop', function () {
            if ( $(this).attr('type') ) {

              $scope.votes[$(this).data('entry')][$(this).data('criteria')] =
                $(this).slider('getValue');

              $scope.$apply();

              console.log('votes updated', $scope.votes);
            }
          });
        }
      };

      // Promote

      /**
        * @abstract     Promote entry (increment schema path `promotions` of Entry)
        * @param
        *   @entry
        *       @type   String
      **/

      $scope.promote = function (entry, position) {

        console.info('Promoting entry', position);

        EntryFactory.promote(entry)
          .success(function (data) {

            var newEntryPosition;

            // Promoting left entry

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

              // Save votes

              $scope.saveVote($scope.right);

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

      // Edit and go again

      $scope.editAndGoAgain = function () {
        location.href='/edit/' + $scope.evaluate.entry;
      };

      // Save vote

      $scope.saveVote = function (entry) {
        var votes = [];

        for ( var criteria in $scope.votes[entry._id] ) {
          votes.push({
            entry: entry._id,
            criteria: criteria,
            value: +$scope.votes[entry._id][criteria]
          });
        }

        $('input.slider[data-entry="' + entry._id + '"]')
          .slider('setValue', 5);

        SignFactory.findByEmail($scope.email)

          .success(function (user) {

            votes = votes.map(function (vote) {
              vote.user = user._id;

              return vote;
            });

            VoteFactory
              .create(votes);
          });
      };

      // ============================
      // FLOW
      // ===================

      console.info('get evaluation');
      $scope.getEvaluation(function () {
        console.info('get criterias');
        $scope.getCriterias(function () {
          $scope.evaluate.entries.forEach(function (entry) {
            $scope.votes[entry._id] = {};

            $scope.criterias.forEach(function (criteria) {
              $scope.votes[entry._id][criteria._id] = 5;

              // tooltips

              setTimeout(function () {
                $('[data-toggle="tooltip"]').tooltip({
                  placement: 'top'
                });
                console.log('hola')
              }, 1000)
            });
          });
        });
      });
    }
  };
};