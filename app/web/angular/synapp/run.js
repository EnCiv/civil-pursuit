;(function () {

  module.exports = ['$rootScope', '$location', '$timeout',
    'DataFactory', 'Truncate', 'View', 'Evaluation',
    Run];

  function Run ($rootScope, $location, $timeout, DataFactory, Truncate, View, Evaluation) {

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

    function show (elem, options, cb) {
      // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

      if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {
        return false;
      }

      // make sure margin-top is equal to height for smooth scrolling

      elem.css('margin-top', '-' + elem.height() + 'px');

      // animate is-section

      elem.find('.is-section:first').animate(
        
        {
          'margin-top': 0,
          // 'padding-top': 0,
        },

        500,

        function () {
          elem.removeClass('is-showing').addClass('is-shown');
          
          $rootScope.publish('did show view', options);
          
          if ( elem.css('margin-top') !== 0 ) {
            elem.animate({'margin-top': 0}, 250);
          }
          
          if ( cb ) cb();
        });

      elem.animate({
         opacity: 1
        }, 500);
    }

    function hide (elem, options, cb) {
      // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

      if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {
        return false;
      }

      elem.removeClass('is-shown').addClass('is-hiding');;

      elem.find('.is-section:first').animate({
          'margin-top': '-' + elem.height() + 'px',
          // 'padding-top': elem.height() + 'px'
        }, 1000, function () {
          elem.removeClass('is-hiding').addClass('is-hidden');
          $rootScope.publish('did hide view', options);
          if ( cb ) cb();
        });

      elem.animate({
         opacity: 0
        }, 1000);
    }

    // SUBSCRIBERS

    $rootScope.subscribe('toggle view', function (options) {

      var view = $('#item-' + options.item).find('.' + options.view);

      if ( ! view.hasClass('is-toggable') ) {
        view.addClass('is-toggable');
      }

      if ( view.hasClass('is-showing') || view.hasClass('is-hiding') ) {
        return false;
      }

      // if there is a shown truncated text

      if ( $('#item-' + options.item).hasClass('is-truncated') ) {
        console.error($('#item-' + options.item).find('span').not('.word').length)
      }

      View.scrollToPointOfAttention($('#item-' + options.item), function () {
      });

      // hide

      if ( view.hasClass('is-shown') ) {
        hide(view, options);
      }

      // show
      
      else {

        function _show () {
          if ( $('#item-' + options.item).find('.is-shown').length ) {
            hide($('#item-' + options.item).find('.is-shown'), options, function () {
              view.removeClass('is-hidden').addClass('is-showing');

              setTimeout(function () {
                show(view, options);
              });
            });
          }
          
          else {
            view.removeClass('is-hidden').addClass('is-showing');

            setTimeout(function () {
              show(view, options);
            });
          }
        }

        switch ( options.view ) {
          case 'evaluator':
            if ( ! view.hasClass('is-loaded') ) {
              return $rootScope.loadEvaluation(options.item)
                .success(function () {
                  view.addClass('is-loaded');
                  _show()
                });
            }
            break;
        }

        _show();

        switch ( options.view ) {
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

    $rootScope.subscribe('toggle creator', function (options) {

      var id = '#panel-' + options.type;

      if ( options.parent ) {
        id += options.parent;
      }

      var panel = $(id);

      var creator = panel.find('.creator');

      if ( creator.hasClass('is-showing') || creator.hasClass('is-hiding') ) {
        return false;
      }

      function toggle () {
        // hide

        if (  creator.hasClass('is-shown') ) {
          hide( creator, options);
        }

        // show

        else {
          if ( panel.find('.is-shown').length ) { 
            hide(panel.find('.is-shown'), options, function () {

              creator.removeClass('is-hidden').addClass('is-showing');

              setTimeout(function () {
                show(creator, options);
              });
            });
          }
          
          else {
            creator.removeClass('is-hidden').addClass('is-showing');

            setTimeout(function () {
              show(creator, options);
            });
          }
        }
      }

      View.scrollToPointOfAttention(panel, function () {
      });

      toggle();
    });
  }

})();
