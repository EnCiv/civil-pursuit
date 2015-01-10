! function () {

  'use strict';

  module.exports = {
    template: '.evaluator',
    controller: function (view, evaluation) {
      var app = this;

      var itemID = '#item-' + evaluation.item;

      var item = $(itemID);

      item.find('.evaluator .cursor').text(evaluation.cursor); 
      item.find('.evaluator .limit').text(evaluation.limit);

      if ( evaluation.cursor < evaluation.limit ) {
        item.find('.evaluator .finish').text('Neither');
      }
      else {
        item.find('.evaluator .finish').text('Finish');
      }

      item.find('.evaluator .finish').on('click', function () {

        evaluation.cursor += 2;

        $(this).off('click');

        if ( evaluation.cursor <= evaluation.limit ) {
          app.render('evaluation', evaluation, function () {
            app.controller('scroll to point of attention')(item.find('.evaluator'));
          });
        }
        else {
          var evaluations = app.model('evaluations');

          evaluations = evaluations.filter(function ($evaluation) {
            return $evaluation.item !== evaluation.item;
          });

          app.model('evaluations', evaluations);

          app.controller('hide')(item.find('.evaluator'));
        }
      });

      // Items

      for ( var i = 0; i < 2; i ++ ) {

        // Increment views counter

        app.emitter('socket').emit('add view',
          evaluation.items[i]._id);

        // Image

        item.find('.evaluator .image:eq(' + i +')').append(
          app.controller('item media')(evaluation.items[i]));

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
                app.emitter('socket').emit('insert feedback', {
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

              app.emitter('socket').emit('insert votes', votes);

              // next

              evaluation.cursor ++;

              if ( evaluation.cursor <= evaluation.limit ) {

                evaluation.items = evaluation.items.filter(
                  function (_item, index) {
                    return index !== unpromoted;
                  });

                app.render('evaluation', evaluation, function () {
                  app.controller('scroll to point of attention')(item.find('.evaluator'));
                });
              }
              
              else {
                var evaluations = app.model('evaluations');

                evaluations = evaluations.filter(function ($evaluation) {
                  return $evaluation.item !== evaluation.item;
                });

                app.model('evaluations', evaluations);

                app.controller('hide')(item.find('.evaluator'));
              }
            
            }.bind({ position: i }));

        item.find('.evaluator .promote:eq(' + i + ')')
          .addClass('once')
          .text(evaluation.items[i].subject);
      }
    }
  };

} ();
