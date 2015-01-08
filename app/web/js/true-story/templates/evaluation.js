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
        console.warn('cursor', evaluation.cursor);

        evaluation.cursor += 2;

        $(this).off('click');

        app.render('evaluation', evaluation, function () {
          app.controller('scroll to point of attention')(item.find('.evaluator'));
        });
      });

      for ( var i = 0; i < 2; i ++ ) {

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
              view.find('input.slider').slider();
              view.find('input.slider').slider('setValue', 0);
              view.find('input.slider').slider('on', 'slideStop',
                function () {

                });
            }
          };

          app.render(template, {}, function (view) {
            view.removeClass('template-model');
            
            item.find('.evaluator .sliders:eq(' + this.index + ')')
              .append(view);
          
          }.bind({ index: i }));
        });
      }
    }
  };

} ();
