;(function () {

  module.exports = ['$rootScope', 'DataFactory', Run];

  function Run ($rootScope, DataFactory) {

    $rootScope.items        =   [];
    $rootScope.evaluations  =   [];
    $rootScope.feedbacks    =   [];
    $rootScope.votes        =   [];
    $rootScope.show         =   {};
    $rootScope.loadedItems  =   {};

    $rootScope.getItems = function (item) {
      DataFactory.Item.find(item)
        .success(function (items) {
          $rootScope.items = $rootScope.items.concat(items);
          $rootScope.loadedItems[item.parent || item.type] = true; 
        })
        .error(function () {
          console.log(arguments);
        });
    };

    $rootScope.getItems({ type: 'Topic' });

    $rootScope.addViewToItem = function (item) {
      DataFactory.Item.update(item._id, { $inc: { views: 1 } });
    };

    $rootScope.loadEvaluation = function (item_id) {
      var evaluation = $rootScope.evaluations
        .filter(function (evaluation) {
          return evaluation.item === item_id;
        });

      if ( ! evaluation.length ) {
        DataFactory.Item.evaluate(item_id)
          .success(function (evaluation) {
            evaluation.cursor = 1;
            evaluation.limit = 5;
            if ( evaluation.items.length < 6 ) {
              evaluation.limit = evaluation.items.length - 1;

              if ( ! evaluation.limit && evaluation.items.length === 1 ) {
                evaluation.limit = 1;
              }
            }
            evaluation.current = [];
            evaluation.next = [];

            var series = [
              function () { 
                evaluation.current[0] = evaluation.items.shift();
                $rootScope.addViewToItem(evaluation.current[0]);
              },
              function () {
                evaluation.current[1] = evaluation.items.shift();
                $rootScope.addViewToItem(evaluation.current[1]); 
              },
              function () { evaluation.next[0]    = evaluation.items.shift(); },
              function () { evaluation.next[1]    = evaluation.items.shift(); },
            ];

            var i = 0;

            while ( series[i] && evaluation.items.length ) {
              series[i]();
              i++;
            }


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
