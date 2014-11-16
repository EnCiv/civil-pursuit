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

    function Evaluation (evaluation) {

      this.item       =   evaluation.item;
      this.items      =   evaluation.items;
      this.type       =   evaluation.type;
      this.criterias  =   evaluation.criterias;

      this.cursor   =   1;
      this.limit    =   5;
      
      if ( this.items.length < 6 ) {
        this.limit = this.items.length - 1;

        if ( ! this.limit && this.items.length === 1 ) {
          this.limit = 1;
        }
      }
      
      this.current  =   [];
      this.next     =   [];

      var series = [
        function () { 
          this.current[0] = this.items.shift();
          $rootScope.addViewToItem(this.current[0]);
        }.bind(this),
        
        function () {
          this.current[1] = this.items.shift();
          $rootScope.addViewToItem(this.current[1]); 
        }.bind(this),
        
        function () { this.next[0] = this.items.shift(); }.bind(this),
        
        function () { this.next[1] = this.items.shift(); }.bind(this),
      ];

      var i = 0;

      while ( series[i] && evaluation.items.length ) {
        series[i]();
        i++;
      }
    }

    Evaluation.prototype.change = function(d) {
      d = d || 'both';

      console.log(this);

      if ( this.current[0] ) {
        // if ( this.current[0].$feedback ) {
        //   DataFactory.Feedback.create(this.current[0]._id,
        //     this.current[0].$feedback);
        // }
      }

      if ( this.current[1] ) {
        // if ( this.current[1].$feedback ) {
        //   DataFactory.Feedback.create(this.current[1]._id,
        //     this.current[1].$feedback);
        // }
      }

      if ( this.next.length ) {
        if ( d === 'left' || d === 'both' ) {
          this.current[0] = this.next.shift();
          $rootScope.addViewToItem(this.current[0]);
        }

        if ( d === 'right' || d === 'both' ) {
          if ( this.next.length ) {
            this.current[1] = this.next.shift();
            $rootScope.addViewToItem(this.current[1]);
          }
          else {
            delete this.current[1];
          }
        }

        if ( d === 'both' ) {
          if ( this.items.length ) {
            this.next.push(this.items.shift());
            this.cursor ++;
          }
        }

        this.next.push(this.items.shift());
        this.cursor ++;
      }
    };

    Evaluation.prototype.continue = function() {
      this.change();
    };

    $rootScope.loadEvaluation = function (item_id) {
      var evaluation = $rootScope.evaluations
        .filter(function (evaluation) {
          return evaluation.item === item_id;
        });

      if ( ! evaluation.length ) {
        DataFactory.Item.evaluate(item_id)
          .success(function (evaluation) {

            $rootScope.evaluations.push(new Evaluation(evaluation));

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
