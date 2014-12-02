;(function () {

  module.exports = ['$rootScope', '$location', '$timeout',
    'DataFactory', 'Truncate', 'View',
    Run];

  function Run ($rootScope, $location, $timeout, DataFactory, Truncate, View) {

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

      if ( ! item ) { return };

      DataFactory.Item.update(item._id, { $inc: { views: 1 } });
      $rootScope.items.forEach(function (_item, index) {
        if ( _item._id === item._id ) {
          $rootScope.items[index].views += 1;
        }
      });
    };

    $rootScope.addPromotionToItem = function (item) {
      console.log('promoting');
      DataFactory.Item.update(item._id, { $inc: { promotions: 1 } });
      $rootScope.items.forEach(function (_item, index) {
        if ( _item._id === item._id ) {
          $rootScope.items[index].promotions += 1;
        }
      });
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
      this.votes      =   [];

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

      if ( this.current[0] ) {

        // feedback

        if ( this.current[0].$feedback ) {
          DataFactory.Feedback.create(this.current[0]._id,
            this.current[0].$feedback);

          $rootScope.items.forEach(function (item, index) {
            if ( item._id === this._id ) {
              this.$feedback.item = item._id;
              $rootScope.feedbacks.push(this.$feedback);
            }
          }.bind(this.current[0]));
        }

        // Votes

        if ( this.votes[this.current[0]._id] ) {

          var votes = [];

          for ( var criteria in this.votes[this.current[0]._id] ) {
            votes.push({
              item: this.current[0]._id,
              criteria: criteria,
              value: this.votes[this.current[0]._id][criteria]
            });
          }

          if ( votes.length ) {
            DataFactory.Vote.create(votes);
            var found = false;

            $rootScope.votes.forEach(function (vote, index) {
              console.warn(vote, this._id, index);
              if ( vote.item === this._id ) {
                found = index;
              }
            }.bind(this.current[0]));

            console.error('watch out', found, found !== false)

            if ( found !== false ) {
              console.warn($rootScope.votes, found)
              for ( var criteria in this.votes[this.current[0]._id] ) {
                $rootScope.votes[found].criterias[criteria].total ++;
                $rootScope.votes[found].criterias[criteria].values[this.votes[this.current[0]._id][criteria]] ++;
              }
            }
          }
        }
      }

      if ( this.current[1] ) {

        // Feedback

        if ( this.current[1].$feedback ) {
          DataFactory.Feedback.create(this.current[1]._id,
            this.current[1].$feedback);

          $rootScope.items.forEach(function (item, index) {
            if ( item._id === this._id ) {
              this.$feedback.item = item._id;
              $rootScope.feedbacks.push(this.$feedback);
            }
          }.bind(this.current[1]));
        }

        // Votes

        if ( this.votes[this.current[1]._id] ) {

          console.info('votes detected')

          var votes = [];

          for ( var criteria in this.votes[this.current[1]._id] ) {
            votes.push({
              item: this.current[1]._id,
              criteria: criteria,
              value: this.votes[this.current[1]._id][criteria]
            })
          }

          if ( votes.length ) {

            var found = false;

            $rootScope.votes.forEach(function (vote, index) {
              if ( vote.item === this._id ) {
                found = index;
              }
            }.bind(this.current[1]));

            DataFactory.Vote.create(votes)
              .success(function () {
                if ( found !== false ) {
                  for ( var criteria in this ) {
                    $rootScope.votes[found].criterias[criteria].total ++;
                    $rootScope.votes[found].criterias[criteria].values[this[criteria]] ++;
                  }
                }
              }.bind(this.votes[this.current[1]._id]));
          }

          
        }
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
            this.current.splice(1, 1);
          }
        }

        if ( d === 'both' ) {
          if ( this.items.length ) {
            this.next.push(this.items.shift());
          }

          if ( this.cursor !== this.limit ) {
            this.cursor ++;
          }
        }

        if ( this.items.length ) {
          this.next.push(this.items.shift());
        }
        
        if ( this.cursor !== this.limit ) {
          this.cursor ++;
        }
      }

      else {
        this.current = [];
      }
    };

    Evaluation.prototype.continue = function() {
      this.change();
    };

    Evaluation.prototype.finish = function () {
      this.change();
    };

    Evaluation.prototype.promote = function(pos) {
      // Promoting left item

      if ( pos === 0 ) {

        $rootScope.addPromotionToItem(this.current[0]);

        this.change('right');
        
      }

      // Promoting right item

      else {

        $rootScope.addPromotionToItem(this.current[1]);

        this.change('left');

      }
    };

    $rootScope.loadEvaluation = function (item_id) {
      var evaluation = $rootScope.evaluations
        .filter(function (evaluation) {
          return evaluation.item === item_id;
        });

      if ( ! evaluation.length ) {
        return DataFactory.Item.evaluate(item_id)
          .success(function (evaluation) {

            $rootScope.evaluations.push(new Evaluation(evaluation));

          });
      }

      else {

      }
    };

    $rootScope.loadDetails = function (item_id) {

      DataFactory.Item.details(item_id)
        .success(function (details) {
          console.log('details', details)
          

          var feedbacks = details.feedbacks;

          if ( $rootScope.feedbacks.length ) {
            feedbacks = feedbacks.filter(function (feedback) {
              return $rootScope.feedbacks.some(function (_feedback) {
                return _feedback._id === feedback._id;
              });
            });
          }

          $rootScope.feedbacks = $rootScope.feedbacks.concat(feedbacks);



          var vote = {
            item: item_id,
            criterias: details.votes
          };

          $rootScope.votes = $rootScope.votes
            .filter(function (vote) {
              return vote.item !== item_id;
            });

          $rootScope.votes.push(vote);

        });
    };

    // Load intro

    DataFactory.Item.find({ type: 'Intro' })
      .success(function (items) {
        $rootScope.intro = items[0];

        $timeout(function () {
          new Truncate($('#intro'));
          // console.log(Truncate);
        });

        // $(window).on('resize', ellipsis.bind($('#intro .item-text')));
      });


    // UI EVENT

    $rootScope.__channels = {};

    $rootScope.publish = function (channel, message) {
      if ( $rootScope.__channels[channel] ) {
        $rootScope.__channels[channel].forEach(function (subscriber) {
          subscriber(message);
        });
      }
    };

    $rootScope.subscribe = function (channel, subscriber) {
      if ( ! $rootScope.__channels[channel] ) {
        $rootScope.__channels[channel] = [];
      }

      $rootScope.__channels[channel].push(subscriber);
    };



    $rootScope.subscribe('toggle view', function (options) {

      console.log('toggle view', options)

      var view = $('#item-' + options.item).find('.' + options.view);

      function show (elem, cb) {
        elem.css('margin-top', '-' + elem.height() + 'px');

        elem.find('.is-section:first').animate({
            'margin-top': 0
          }, 750, function () {
            elem.removeClass('is-showing').addClass('is-shown');
            $rootScope.publish('did show view', options);
            if ( cb ) cb();
          });

        elem.animate({
           opacity: 1
          }, 700);
      }

      function hide (elem, cb) {
        elem.removeClass('is-shown').addClass('is-hiding');;

        elem.find('.is-section:first').animate({
            'margin-top': '-' + elem.height() + 'px'
          }, 750, function () {
            elem.removeClass('is-hiding').addClass('is-hidden');
            $rootScope.publish('did hide view', options);
            if ( cb ) cb();
          });

        elem.animate({
           opacity: 0
          }, 750);
      }

      // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

      if ( $('#item-' + options.item).hasClass('.is-showing') ) {
        return false;
      }

      if ( ! view.hasClass('is-toggable') ) {
        view.addClass('is-toggable');
      }

      var itemTop = $('#item-' + options.item).offset().top;
      var windowScroll = $(window).scroll();

      console.log({item: itemTop, scroll: windowScroll});

      View.scrollToPointOfAttention($('#item-' + options.item), function () {
        // hide

        if ( view.hasClass('is-shown') ) {
          hide(view);
        }

        // show
        
        else {

          if ( $('#item-' + options.item).find('.is-shown').length ) {
            hide($('#item-' + options.item).find('.is-shown'), function () {
              view.removeClass('is-hidden').addClass('is-showing');

              setTimeout(function () {
                show(view);
              });
            });
          }
          
          else {
            view.removeClass('is-hidden').addClass('is-showing');

            setTimeout(function () {
              show(view);
            });
          }

          switch ( options.view ) {
            case 'evaluator':
              if ( ! view.hasClass('is-loaded') ) {
                $rootScope.loadEvaluation(options.item)
                  .success(function () {
                    view.addClass('is-loaded');
                  });
              }
              break;

            case 'children':
              if ( ! view.hasClass('is-loaded') && ! view.hasClass('is-loading') ) {
                $rootScope.publish('load children', {
                  parent: options.item,
                  view: view
                });
              }
              break;
          }
        }
      });
    });
  }

})();
