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

      var $evaluator  =   item.find('.evaluator').eq(0);

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

        // Increment views counter

        Socket.emit('add view', eItem._id);

        // Image

        $evaluator.find('.image:eq(' + pos + ')')
          .empty()
          .append(Item.controller('item media')(eItem));

        // Subject

        $evaluator.find('.subject:eq(' + pos + ')')
          .text(eItem.subject);

        // Description

        $evaluator.find('.description:eq(' + pos + ')')
          .text(eItem.description);

        // Sliders

        $evaluator.find('.sliders:eq(' + pos + ')')
          .empty();

        evaluation.criterias.forEach(function (criteria) {
          
          var template_name = 'evaluation-' + evaluation.item +
            '-' + pos + '-' + criteria._id;

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

          app.render(template, {}, function (view) {
            view.removeClass('template-model');
            
            $evaluator.find('.sliders:eq(' + this.index + ')')
              .append(view);
          
          }.bind({ index: pos }));
        
        });

        // Promote button

        $evaluator.find('.promote:eq(' + pos + ')')
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

      // Promote

      $evaluator.find('.promote').on('click', function () {
        Panel.controller('scroll to point of attention')($evaluator);

        var pos = $(this).data('position');

        var unpromoted = pos ? 0 : 1;

        if ( _evaluation.cursor < _evaluation.limit ) {
          _evaluation.cursor = (_evaluation.cursor + 1);

          if ( unpromoted ) {
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

        var evaluations = app.model('evaluations');

        evaluations = evaluations.filter(function ($evaluation) {
          return $evaluation.item !== evaluation.item;
        });

        app.model('evaluations', evaluations);

        Panel.controller('hide')($evaluator,
          function () {
            item.find('.toggle-details').eq(0).click();
          });
      }

      return;

      item.find('.evaluator .finish').on('click', function () {

        evaluation.cursor += 2;

        $(this).off('click');

        if ( evaluation.cursor <= evaluation.limit ) {
          app.render('evaluation', evaluation, function () {
            Panel.controller('scroll to point of attention')(item.find('.evaluator'));
          });
        }
        else {
          var evaluations = app.model('evaluations');

          evaluations = evaluations.filter(function ($evaluation) {
            return $evaluation.item !== evaluation.item;
          });

          app.model('evaluations', evaluations);

          Panel.controller('hide')(item.find('.evaluator'));
        }
      });

      // Items

      for ( var i = 0; i < 2; i ++ ) {

        // Increment views counter

        Socket.emit('add view',
          evaluation.items[i]._id);

        // Image

        item.find('.evaluator .image:eq(' + i +')').append(
          Item.controller('item media')(evaluation.items[i]));

        item.find('.evaluator .subject:eq(' + i +')').text(
          evaluation.items[i].subject);

        item.find('.evaluator .description:eq(' + i +')').text(
          evaluation.items[i].description);

        item.find('.evaluator .sliders:eq(' + i + ') .criteria-slider')
          .not('.template-model').remove();

        evaluation.criterias.forEach(function (criteria) {
          var template_name = 'evaluation-' + evaluation.item +
            '-' + i + '-' + criteria._id;

          var template = {
            name: template_name,
            template: item.find('.evaluator .criteria-slider:eq(0)'),
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

          app.render(template, {}, function (view) {
            view.removeClass('template-model');
            
            item.find('.evaluator .sliders:eq(' + this.index + ')')
              .append(view);
          
          }.bind({ index: i }));
        });

        // Promote

        item.find('.evaluator .promote:eq(' + i + ')')
          .not('.once')
          .on('click',
            function () {
              var unpromoted;

              // odd

              if ( this.position % 2 ) {
                unpromoted = this.position - 1;
              }

              // even

              else {
                unpromoted = this.position + 1;
              }

              // feedback

              var feedback = item.find('.evaluator .feedback:eq(' +
                unpromoted + ')');

              if ( feedback.val() ) {
                Socket.emit('insert feedback', {
                  item: evaluation.items[unpromoted]._id,
                  user: synapp.user,
                  feedback: feedback.val()
                });

                feedback.val('');
              }

              // votes

              var votes = [];

              item.find('.evaluator .sliders:eq(' + unpromoted + ') input.slider').each(function () {
                  var vote = {
                    item: evaluation.items[unpromoted]._id,
                    user: synapp.user,
                    value: $(this).data('slider-value'),
                    criteria: $(this).data('criteria-id')
                  };

                  votes.push(vote);
                });

              Socket.emit('insert votes', votes);

              // next

              evaluation.cursor ++;

              if ( evaluation.cursor <= evaluation.limit ) {

                evaluation.items = evaluation.items.filter(
                  function (_item, index) {
                    return index !== unpromoted;
                  });

                app.render('evaluation', evaluation, function () {
                  Panel.controller('scroll to point of attention')(item.find('.evaluator'));
                });
              }
              
              else {
                var evaluations = app.model('evaluations');

                evaluations = evaluations.filter(function ($evaluation) {
                  return $evaluation.item !== evaluation.item;
                });

                app.model('evaluations', evaluations);

                Panel.controller('hide')(item.find('.evaluator'));
              }
            
            }.bind({ position: i }));

        item.find('.evaluator .promote:eq(' + i + ')')
          .addClass('once')
          .text(evaluation.items[i].subject);
      }
    }
  };

} ();
