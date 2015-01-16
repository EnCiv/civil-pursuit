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

      var _evaluation =   {
        cursor:   0,
        limit:    0,
        left:     null,
        right:    null
      };

      var follow      =     app.watch(_evaluation);

      // Cursor

      follow.on('update cursor', function (cursor) {
        $evaluator.find('.cursor').text(cursor.new);

        if ( cursor.new < _evaluation.limit ) {
          $evaluator.find('.finish').text('Neither');
        }
        else {
          $evaluator.find('.finish').text('Finish');
        }
      });

      // Limit

      follow.on('update limit', function (limit) {
        $evaluator.find('.limit').text(limit.new);
      });

      // Item

      function evaluationItem (eItem, pos) {

        var hand = pos ? 'right' : 'left';

        // Increment views counter

        Socket.emit('add view', eItem._id);

        // Image

        $sideBySide.find('.image.' + hand + '-item')
          .empty()
          .append(Item.controller('item media')(eItem));

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
          
          var template_name = 'evaluation-' + evaluation.item +
            '-' + pos + '-' + criteria._id;

          // Sliders template

          var template = {
            
            name: template_name,
            
            template: $evaluator.find('.criteria-slider.template-model'),
            
            controller: function (view, locals) {
              view.find('.criteria-name').text(criteria.name);
              view.find('input.slider').data('criteria-id', criteria._id);
              view.find('input.slider').slider();
              view.find('input.slider').slider('setValue', 0);
              view.find('input.slider').slider('on', 'slideStop',
                function () {
                  var slider = $(this);

                  if ( slider.attr('type') ) {

                    var value = slider.slider('getValue');

                    $(this).data('slider-value', value);
                  }
                });
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

        $sideBySide.find('.promote.' + hand + '-item')
          .text(eItem.subject)
          .data('position', pos);
      }

      // Left

      follow.on('update left', function (left) {
        evaluationItem(left.new, 0);
      });

      // Right

      follow.on('update right', function (right) {
        evaluationItem(right.new, 1);
      });

      _evaluation.cursor  =   evaluation.cursor;
      _evaluation.limit   =   evaluation.limit;
      _evaluation.left    =   evaluation.items[0];
      _evaluation.right   =   evaluation.items[1];

      console.warn('ok eval', _evaluation);

      // Promote

      $evaluator.find('.promote').on('click', function () {
        Panel.controller('scroll to point of attention')($evaluator);

        var pos = $(this).data('position');

        var unpromoted = pos ? 0 : 1;

        if ( _evaluation.cursor < _evaluation.limit ) {

          _evaluation.cursor = (_evaluation.cursor + 1);

          if ( unpromoted ) {

            Socket.emit('promote', _evaluation.left);

            saveItem(1, _evaluation.right._id);

            $evaluator.find('.right-item').animate({
              opacity: 0
            }, function () {
              _evaluation.right = evaluation.items[_evaluation.cursor];

              $evaluator.find('.right-item').animate({
                opacity: 1
              });
            });
          }

          else {
            Socket.emit('promote', _evaluation.right);

            saveItem(0, _evaluation.left._id);

            $evaluator.find('.left-item').animate({
              opacity: 0
            }, function () {
              _evaluation.left = evaluation.items[_evaluation.cursor];

              $evaluator.find('.left-item').animate({
                opacity: 1
              });
            });
          }

        }

        else {
          finish();
        }
      });

      // Neither / Finish

      $evaluator.find('.finish').on('click', function () {
        console.log('dshgdhs<dgh<sdhsdhshgjd')

        Panel.controller('scroll to point of attention')($evaluator);

        if ( _evaluation.cursor === _evaluation.limit ) {
          finish();
        }
        else {
          // Left

          _evaluation.cursor = (_evaluation.cursor + 1);

          saveItem(0, _evaluation.left._id);

          $evaluator.find('.left-item').animate({
              opacity: 0
            }, function () {
              _evaluation.left = evaluation.items[_evaluation.cursor];

              $evaluator.find('.left-item').animate({
                opacity: 1
              });
            });

          // Right

          _evaluation.cursor = (_evaluation.cursor + 1);

          saveItem(1, _evaluation.right._id);

          $evaluator.find('.right-item').animate({
              opacity: 0
            }, function () {
              _evaluation.right = evaluation.items[_evaluation.cursor];

              $evaluator.find('.right-item').animate({
                opacity: 1
              });
            });

          // Adjust cursor

          if ( _evaluation.limit - _evaluation.cursor === 1 ) {
            _evaluation.cursor = _evaluation.limit;
          }
        }
      });

      // Save votes and feeback

      function saveItem (pos, id) {
        // feedback

        var feedback = $evaluator.find('.feedback:eq(' + pos + ')');

        if ( feedback.val() ) {
          Socket.emit('insert feedback', {
            item: id,
            user: synapp.user,
            feedback: feedback.val()
          });

          feedback.val('');
        }

        // votes

        var votes = [];

        $evaluator.find('.sliders:eq(' + pos + ') input.slider')
          .each(function () {
            var vote = {
              item: id,
              user: synapp.user,
              value: $(this).data('slider-value') || 1,
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
