! function () {

  'use strict';

  function render (evaluation) {

    var div         =   this;

    var Socket      =   div.root.emitter('socket');

    var Panel       =   div.root.extension('Panel');

    var Item        =   div.root.extension('Item');

    var promoteDiv  =   Div.factory({

    });

    return function (view) {
      var $sideBySide   =   view.find('.items-side-by-side');

      var $item = view.closest('.item');

      // Limit

      promoteDiv.bind('limit', function (limit) {
        view.find('.limit').text(limit);
      });

      promoteDiv.model('limit', evaluation.limit);

      // Cursor

      promoteDiv.bind('cursor', function (cursor) {
        view.find('.cursor').text(cursor);

        if ( cursor < promoteDiv.model('limit') ) {
          view.find('.finish').text('Neither');
        }
        else {
          view.find('.finish').text('Finish');
        }
      });

      promoteDiv.model('cursor', evaluation.cursor);

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

          if ( image.hasClass('youtube-thumbnail') ) {

            image = $('#item-' + eItem._id).find('.youtube-preview')
              .clone();
          }
        }

        image = image || Item.controller('item media')(eItem);

        if ( image.hasClass('youtube-preview') ) {
          setTimeout(function () {
            Item.controller('youtube play icon')(view);
          }, 1000);
        }

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

          // Render sliders template

          luigi('tpl-promote-sliders')

            .controller(function ($sliders) {
              $sliders.find('.criteria-name').text(criteria.name);

              $sliders.find('input[type="range"]')
                .data('criteria', criteria._id)
                .rangeslider();

              $sideBySide
                .find('.sliders.' + hand + '-item')
                .append($sliders);
            });

        });

        // Promote button

        $sideBySide.find('.' + hand + '-item .promote')
          .data('position', pos);
      }

      // Left

      promoteDiv.bind('left', function (left, old, event) {
        evaluationItem(left, 0);
        
        if ( left ) {
          view.find('.left-item .promote').text(left.subject);
        }
      });

      promoteDiv.model('left', evaluation.items[0]);

      // Right

      promoteDiv.bind('right', function (right) {
        evaluationItem(right, 1);
        
        if ( right ) {
          view.find('.right-item .promote').text(right.subject);
        }
      });

      promoteDiv.model('right', evaluation.items[1]);

      // Promote

      view.find('.promote').on('click', function () {
        Panel.controller('scroll to point of attention')(view);

        var pos = $(this).data('position');

        var unpromoted = pos ? 0 : 1;

        if ( promoteDiv.model('cursor') < promoteDiv.model('limit') ) {

          promoteDiv.inc('cursor');

          if ( unpromoted ) {

            Socket.emit('promote', promoteDiv.model('left'));

            saveItem('right');

            var rights = [view.find('.right-item').length, 0];

            view.find('.right-item').animate({
              opacity: 0
            }, function () {
              rights[1] ++;

              if( rights[0] === rights[1] ) {
                promoteDiv.model('right', evaluation.items[promoteDiv.model('cursor')]);

                view.find('.right-item').animate({
                  opacity: 1
                });
              }
            });
          }

          else {
            Socket.emit('promote', promoteDiv.model('right'));

            saveItem('left');

            var lefts = [view.find('.left-item').length, 0];

            view.find('.left-item').animate({
              opacity: 0
            }, function () {

              lefts[1] ++;

              if( lefts[0] === lefts[1] ) {
                promoteDiv.model('left', evaluation.items[promoteDiv.model('cursor')]);

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

        if ( promoteDiv.model('cursor') === promoteDiv.model('limit') ) {
          finish();
        }
        
        else {
          // Left

          promoteDiv.inc('cursor');

          saveItem('left');

          var lefts = [view.find('.left-item').length, 0];

          view.find('.left-item').animate({
              opacity: 0
            }, function () {
              lefts[1] ++;

              if( lefts[0] === lefts[1] ) {
                promoteDiv.model('left', evaluation.items[promoteDiv.model('cursor')]);

                view.find('.left-item').animate({
                  opacity: 1
                });
              }
            });

          // Right

          promoteDiv.inc('cursor');

          saveItem('right');

          var rights = [view.find('.right-item').length, 0];

          view.find('.right-item').animate({
              opacity: 0
            }, function () {
              rights[1] ++;

              if( rights[0] === rights[1] ) {
                promoteDiv.model('right', evaluation.items[promoteDiv.model('cursor')]);

                view.find('.right-item').animate({
                  opacity: 1
                });
              }
            });


          // Adjust cursor

          if ( promoteDiv.model('limit') - promoteDiv.model('cursor') === 1 ) {
            promoteDiv.model('cursor', promoteDiv.model('limit'));
          }
        }
      });

      // Save votes and feeback

      function saveItem (hand) {
   
        // feedback

        var feedback = view.find('.' +  hand + '-item .feedback');

        if ( feedback.val() ) {
          Socket.emit('insert feedback', {
            item: promoteDiv.model(hand)._id,
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
              item: promoteDiv.model(hand)._id,
              user: synapp.user,
              value: +$(this).val(),
              criteria: $(this).data('criteria')
            };

            votes.push(vote);
          });

        Socket.emit('insert votes', votes);
      }

      // Finish

      function finish () {

        view.find('.promote').off('click');
        view.find('.finish').off('click');

        if ( promoteDiv.model('left') ) {
          saveItem('left');
        }

        if ( promoteDiv.model('right') ) {
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
            $item.find('.toggle-details').eq(0).click();
            $item.find('.details:eq(0) .feedback-pending')
              .removeClass('hide');
          });
      }
    }
  }

  module.exports = render;

} ();
