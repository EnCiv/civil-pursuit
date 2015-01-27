! function () {

  'use strict';

  function render (evaluation) {

    var div         =   this;

    var Socket      =   div.root.emitter('socket');

    var Panel       =   div.root.extension('Panel');

    var Item        =   div.root.extension('Item');

    return function (view) {
      var $sideBySide   =   view.find('.items-side-by-side');

      // Cursor

      div.bind('cursor', function (cursor) {
        view.find('.cursor').text(cursor);

        if ( cursor < div.model('limit') ) {
          view.find('.finish').text('Neither');
        }
        else {
          view.find('.finish').text('Finish');
        }
      });

      div.model('cursor', evaluation.cursor);

      // Limit

      div.bind('limit', function (limit) {
        view.find('.limit').text(limit);
      });

      div.model('limit', evaluation.limit);

      // Item

      function evaluationItem (eItem, pos) {

        var hand = pos ? 'right' : 'left';

        // If null

        if ( ! eItem ) {
          $sideBySide
            .find('.subject.' + hand + '-item')
            .hide();

          $sideBySide
            .find('.is-des.' + hand + '-item')
            .hide();

          $sideBySide
            .find('.sliders.' + hand + '-item')
            .hide();

          $sideBySide
            .find('.' + hand + '-item .feedback')
            .closest('.' + hand + '-item')
            .hide();

          $sideBySide
            .find('.' + hand + '-item .promote')
            .closest('.' + hand + '-item')
            .hide();

          // If one missing

          $sideBySide.find('.promote-label').hide();
          $sideBySide.find('.promote').hide();

          // if ( hand === 'right' && ( ! div.model('left') || ! app.model('right') ) ) {
          //   $sideBySide.find('.promote-label').hide();
          // }
          return;
        }

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

        console.info('criterias', evaluation.criterias.length);

        evaluation.criterias.forEach(function (criteria) {

          /// Render sliders template

          // div.render('sliders', criteria, function (view) {
          //   view.removeClass('template-model');
            
          //   $sideBySide.find('.sliders.' + hand + '-item')
          //     .append(view);
          
          // }.bind({ index: pos, hand: hand }));

        });

        // Promote button

        $sideBySide.find('.' + hand + '-item .promote')
          .data('position', pos);
      }

      // Left

      div.bind('left', function (left, old, event) {
        evaluationItem(left, 0);
        
        if ( left ) {
          view.find('.left-item .promote').text(left.subject);
        }
      });

      div.model('left', evaluation.items[0]);

      // Right

      div.bind('right', function (right) {
        evaluationItem(right, 1);
        
        if ( right ) {
          view.find('.right-item .promote').text(right.subject);
        }
      });

      div.model('right', evaluation.items[1]);

      // Promote

      view.find('.promote').on('click', function () {
        Panel.controller('scroll to point of attention')(view);

        var pos = $(this).data('position');

        var unpromoted = pos ? 0 : 1;

        console.info('unpromoted', unpromoted, pos)

        if ( div.model('cursor') < div.model('limit') ) {

          div.inc('cursor');

          if ( unpromoted ) {

            Socket.emit('promote', div.model('left'));

            saveItem('right');

            var rights = [view.find('.right-item').length, 0];

            view.find('.right-item').animate({
              opacity: 0
            }, function () {
              rights[1] ++;

              if( rights[0] === rights[1] ) {
                div.model('right', evaluation.items[div.model('cursor')]);

                view.find('.right-item').animate({
                  opacity: 1
                });
              }
            });
          }

          else {
            Socket.emit('promote', div.model('right'));

            saveItem('left');

            var lefts = [view.find('.left-item').length, 0];

            view.find('.left-item').animate({
              opacity: 0
            }, function () {

              lefts[1] ++;

              if( lefts[0] === lefts[1] ) {
                div.model('left', evaluation.items[div.model('cursor')]);

                view.find('.left-item').animate({
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

      view.find('.finish').on('click', function () {

        Panel.controller('scroll to point of attention')(view);

        if ( div.model('cursor') === div.model('limit') ) {
          finish();
        }
        
        else {
          // Left

          div.inc('cursor');

          saveItem('left');

          var lefts = [view.find('.left-item').length, 0];

          view.find('.left-item').animate({
              opacity: 0
            }, function () {
              lefts[1] ++;

              if( lefts[0] === lefts[1] ) {
                div.model('left', evaluation.items[div.model('cursor')]);

                view.find('.left-item').animate({
                  opacity: 1
                });
              }
            });

          // Right

          div.inc('cursor');

          saveItem('right');

          var rights = [view.find('.right-item').length, 0];

          view.find('.right-item').animate({
              opacity: 0
            }, function () {
              rights[1] ++;

              if( rights[0] === rights[1] ) {
                div.model('right', evaluation.items[div.model('cursor')]);

                view.find('.right-item').animate({
                  opacity: 1
                });
              }
            });


          // Adjust cursor

          if ( div.model('limit') - div.model('cursor') === 1 ) {
            div.model('cursor', div.model('limit'));
          }
        }
      });

      // Save votes and feeback

      function saveItem (hand) {
   
        // feedback

        var feedback = view.find('.' +  hand + '-item .feedback');

        if ( feedback.val() ) {
          Socket.emit('insert feedback', {
            item: div.model(hand)._id,
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
              item: div.model(hand)._id,
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

        view.find('.promote').off('click');
        view.find('.finish').off('click');

        if ( div.model('left') ) {
          saveItem('left');
        }

        if ( div.model('right') ) {
          saveItem('right');
        }

        view.find('.promote,.finish').off('click');

        var evaluations = div.model('evaluations');

        evaluations = evaluations.filter(function ($evaluation) {
          return $evaluation.item !== evaluation.item;
        });

        div.model('evaluations', evaluations);

        Panel.controller('hide')(view,
          function () {
            item.find('.toggle-details').eq(0).click();
            item.find('.details:eq(0) .feedback-pending')
              .removeClass('hide');
          });
      }
    }
  }

  module.exports = render;

} ();
