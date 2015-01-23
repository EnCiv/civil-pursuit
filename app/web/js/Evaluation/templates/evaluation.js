! function () {

  'use strict';

  module.exports = {
    template: '.evaluator',
    controller: function (view, evaluation) {

      var app = this;

      var Socket      =   app.importer.emitter('socket');

      var Panel       =   app.importer.extension('Panel');

      var Item        =   app.importer.extension('Item');

      var itemID      =   '#item-' + evaluation.item;

      var item        =   $(itemID);

      var $evaluator  =   item.find('>.collapsers >.evaluator');
      var $sideBySide =   $evaluator.find('.items-side-by-side');

      // Cursor

      app.bind('cursor', function (cursor) {
        console.log('cursor updated');

        $evaluator.find('.cursor').text(cursor);

        if ( cursor < app.model('limit') ) {
          $evaluator.find('.finish').text('Neither');
        }
        else {
          $evaluator.find('.finish').text('Finish');
        }
      });

      app.model('cursor', evaluation.cursor);

      // Limit

      app.bind('limit', function (limit) {
        $evaluator.find('.limit').text(limit);
      });

      app.model('limit', evaluation.limit);

      // Item

      function evaluationItem (eItem, pos) {

        var hand = pos ? 'right' : 'left';

        console.info(hand, pos)

        // Increment views counter

        Socket.emit('add view', eItem._id);

        // Image

        var image;

        if ( eItem._id === evaluation.item ) {
          image = $('#item-' + eItem._id)
            .find('>.item-media-wrapper img')
            .clone();
        }

        image = image || Item.controller('item media')(eItem);

        $sideBySide
          .find('.image.' + hand + '-item')
          .empty()
          .append(image);

        // Subject

        $sideBySide.find('.subject.' + hand + '-item h3')
          .text(eItem.subject);

        // Description

        $sideBySide.find('.is-des.' + hand + '-item .description')
          .text(eItem.description);

        // References

        if ( eItem.references.length ) {
          $sideBySide.find('.references.' + hand + '-item a')
            .attr('href', eItem.references[0].url)
            .text(eItem.references[0].title || eItem.references[0].url);
        }

        // Sliders

        $sideBySide.find('.sliders.' + hand + '-item')
          .empty();

        evaluation.criterias.forEach(function (criteria) {

          // Sliders template

          var template = {
            
            template: $evaluator.find('.criteria-slider.template-model'),
            
            controller: function (view, locals) {
              
              view.find('.criteria-name').text(criteria.name);


              view.find('input[type="range"]').rangeslider();
            }
          };

          // Render sliders template

          app.render(template, {}, function (view) {
            view.removeClass('template-model');
            
            $sideBySide.find('.sliders.' + hand + '-item')
              .append(view);
          
          }.bind({ index: pos, hand: hand }));

        });

        // Promote button

        $sideBySide.find('.' + hand + '-item .promote')
          .data('position', pos);
      }

      // Left

      app.bind('left', function (left, old, event) {
        evaluationItem(left, 0);
        $evaluator.find('.left-item .promote').text(left.subject);
      });

      app.model('left', evaluation.items[0]);

      // Right

      app.bind('right', function (right) {
        evaluationItem(right, 1);
        $evaluator.find('.right-item .promote').text(right.subject);
      });

      app.model('right', evaluation.items[1]);

      // Promote

      $evaluator.find('.promote').on('click', function () {
        Panel.controller('scroll to point of attention')($evaluator);

        var pos = $(this).data('position');

        var unpromoted = pos ? 0 : 1;

        console.info('unpromoted', unpromoted, pos)

        if ( app.model('cursor') < app.model('limit') ) {

          app.inc('cursor');

          if ( unpromoted ) {

            Socket.emit('promote', app.model('left'));

            saveItem('right');

            var rights = [$evaluator.find('.right-item').length, 0];

            $evaluator.find('.right-item').animate({
              opacity: 0
            }, function () {
              rights[1] ++;

              if( rights[0] === rights[1] ) {
                app.model('right', evaluation.items[app.model('cursor')]);

                $evaluator.find('.right-item').animate({
                  opacity: 1
                });
              }
            });
          }

          else {
            Socket.emit('promote', app.model('right'));

            saveItem('left');

            var lefts = [$evaluator.find('.left-item').length, 0];

            $evaluator.find('.left-item').animate({
              opacity: 0
            }, function () {

              lefts[1] ++;

              if( lefts[0] === lefts[1] ) {
                app.model('left', evaluation.items[app.model('cursor')]);
  
                $evaluator.find('.left-item').animate({
                  opacity: 1
                });
              }
            });
          }

        }

        else {
          finish();
        }
      });

      // Neither / Finish

      $evaluator.find('.finish').on('click', function () {

        Panel.controller('scroll to point of attention')($evaluator);

        if ( app.model('cursor') === app.model('limit') ) {
          finish();
        }
        
        else {
          // Left

          app.inc('cursor');

          saveItem('left');

          var lefts = [$evaluator.find('.left-item').length, 0];

          $evaluator.find('.left-item').animate({
              opacity: 0
            }, function () {
              lefts[1] ++;

              if( lefts[0] === lefts[1] ) {
                app.model('left', evaluation.items[app.model('cursor')]);

                $evaluator.find('.left-item').animate({
                  opacity: 1
                });
              }
            });

          // Right

          app.inc('cursor');

          saveItem('right');

          var rights = [$evaluator.find('.right-item').length, 0];

          $evaluator.find('.right-item').animate({
              opacity: 0
            }, function () {
              rights[1] ++;

              if( rights[0] === rights[1] ) {
                app.model('right', evaluation.items[app.model('cursor')]);

                $evaluator.find('.right-item').animate({
                  opacity: 1
                });
              }
            });


          // Adjust cursor

          if ( app.model('limit') - app.model('cursor') === 1 ) {
            app.model('cursor', app.model('limit'));
          }
        }
      });

      // Save votes and feeback

      function saveItem (hand) {
   
        // feedback

        var feedback = $evaluator.find('.' +  hand + '-item .feedback');

        if ( feedback.val() ) {
          Socket.emit('insert feedback', {
            item: app.model(hand)._id,
            user: synapp.user,
            feedback: feedback.val()
          });

          feedback.val('');
        }

        // votes

        var votes = [];

        $sideBySide
          .find('.' +  hand + '-item input[type="range"]:visible')
          .each(function () {
            var vote = {
              item: app.model(hand)._id,
              user: synapp.user,
              value: +$(this).val(),
              criteria: $(this).data('criteria-id')
            };

            votes.push(vote);
          });

        Socket.emit('insert votes', votes);
      }

      // Finish

      function finish () {

        $evaluator.find('.promote').off('click');
        $evaluator.find('.finish').off('click');

        var evaluations = app.model('evaluations');

        evaluations = evaluations.filter(function ($evaluation) {
          return $evaluation.item !== evaluation.item;
        });

        app.model('evaluations', evaluations);

        Panel.controller('hide')($evaluator,
          function () {
            item.find('.toggle-details').eq(0).click();
            item.find('.details:eq(0) .feedback-pending')
              .removeClass('hide');
          });
      }
    }
  };

} ();
