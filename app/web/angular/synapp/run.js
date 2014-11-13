;(function () {

  module.exports = ['$rootScope', 'DataFactory', Run];

  function Run ($rootScope, DataFactory) {

    $rootScope.items        =   [];
    $rootScope.evaluations  =   [];
    $rootScope.feedbacks    =   [];
    $rootScope.votes        =   [];
    $rootScope.show         =   {};

    $rootScope.getItems = function (item) {
      DataFactory.Item.find(item)
        .success(function (items) {
          $rootScope.items = $rootScope.items.concat(items);
        });
    };

    $rootScope.getItems({ type: 'Topic' });

    $rootScope.loadEvaluation = function (item_id) {
      var evaluation = $rootScope.evaluations
        .filter(function (evaluation) {
          return evaluation.item === item_id;
        });

      if ( ! evaluation.length ) {
        DataFactory.Item.evaluate(item_id)
          .success(function (evaluation) {
            $rootScope.evaluations.push(evaluation);
          });
      }

      else {

      }
    };

    $rootScope.loadDetails = function (item_id) {
      var feedback = $rootScope.feedbacks
        .filter(function (feedback) {
          return feedback.item === item_id;
        });

      if ( ! feedback.length ) {
        DataFactory.Feedback.find({ item: item_id })
          .success(function (feedbacks) {
            $rootScope.feedbacks = $rootScope.feedbacks.concat(feedbacks);
          });
      }

      else {

      }
    };
  }

})();
