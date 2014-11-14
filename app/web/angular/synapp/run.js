;(function () {

  module.exports = ['$rootScope', '$location', 'DataFactory', Run];

  function Run ($rootScope, $location, DataFactory) {

    /** @type [Model.Item] */
    $rootScope.items        =   [];

    /** @type [Evaluation] */
    $rootScope.evaluations  =   [];

    /** @type [Model.Feedback] */
    $rootScope.feedbacks    =   [];

    /** @type [Model.Vote] */
    $rootScope.votes        =   [];

    /** @deprecated */
    $rootScope.show         =   {};

    /** @??? */
    $rootScope.loadedItems  =   {};

    /** { $item_id: [Number] } Item's lineage */
    $rootScope.lineage      =   {};

    /** LOCATION */

    $rootScope.$on('$locationChangeStart', function () {
      switch ( $location.path() ) {
        case '/intro': case 'intro':
          $(window).scrollTop($('#intro').offset().top - 100);
          break;
      }
    });

    /** CRITERIAS */

    $rootScope.criterias = [];

    DataFactory.Criteria.find({})
      .success(function (criterias) {
        $rootScope.criterias = criterias;
      });

    /** ITEMS */

    $rootScope.getItems = function (item) {
      DataFactory.Item.find(item)
        .success(function (items) {
          $rootScope.items = $rootScope.items.concat(items);
          $rootScope.loadedItems[item.parent || item.type] = true;

          /** Lineage */

          items.forEach(function (item) {
            $rootScope.lineage[item._id] = item.parent;
          });

        })
        .error(function () {
          console.log(arguments);
        });
    };

    $rootScope.getItems({ type: 'Topic' });

    $rootScope.addViewToItem = function (item) {
      DataFactory.Item.update(item._id, { $inc: { views: 1 } });
    };

    $rootScope.itemHas = function (item, has) {
      
      
      if ( item && has ) {

        var child = $rootScope.lineage[has];

        while ( child ) {

          if ( child === item._id ) {
            return true;
          }
          child = $rootScope.lineage[child];
        }
      }
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
