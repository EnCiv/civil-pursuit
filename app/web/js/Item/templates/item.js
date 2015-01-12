! function () {

  'use strict';

  module.exports = {
    url: '/partial/item',
    controller: function (view, item) {

      var app = this;

      var Socket = app.importer.emitter('socket');
      var Panel = app.importer.extension('Panel');
      var Evaluation = app.importer.extension('Evaluation');

      view.attr('id', 'item-' + item._id);

      view.find('.item-title a')
        .attr('href', '/item/' + item._id + '/' + require('string')(item.subject).slugify())
        .text(item.subject);
      view.find('.description').text(item.description);

      // REFERENCES

      if ( item.references.length ) {
        view.find('.item-references').show();
        view.find('.item-references a')
          .attr('src', item.references[0].url)
          .text(item.references[0].title || item.references[0].url);
      }
      else {
        view.find('.item-references').hide();
      }

      // TRUNCATE

      new (app.controller('truncate'))(view);

      // ITEM MEDIA

      view.find('.item-media').empty().append(
        app.controller('item media')(item));

      // ITEM STATS

      view.find('.promoted').text(item.promotions);
      
      if ( item.promotions ) {
        view.find('.promoted-percent').text(
          Math.floor(item.promotions * 100 / item.views) + '%');
      }
      else {
        view.find('.promoted-percent').text('0%');
      }

      // ITEM TOGGLE PROMOTE

      view.find('.toggle-promote').on('click', function () {

        var evaluator = view.find('.evaluator');

        if ( ! evaluator.hasClass('is-toggable') ) {
          evaluator.addClass('is-toggable');
        }

        if ( evaluator.hasClass('is-showing') || evaluator.hasClass('is-hiding') ) {
          return false;
        }

        evaluator.removeClass('is-hidden').addClass('is-showing');

        Panel.controller('scroll to point of attention')(view, function () {
          Panel.controller('show')(evaluator);

          var evaluationExists = Evaluation.model('evaluations')
            .some(function (evaluation) {
              return evaluation.item === item._id;
            });

          if ( ! evaluationExists ) {
            Socket.emit('get evaluation', item);
          }
        });

        return false;
      });

      // ITEM TOGGLE DETAILS

      view.find('.toggle-details').on('click', function () {

        var details = view.find('.details');

        if ( ! details.hasClass('is-toggable') ) {
          details.addClass('is-toggable');
        }

        if ( details.hasClass('is-showing') || details.hasClass('is-hiding') ) {
          return false;
        }

        details.removeClass('is-hidden').addClass('is-showing');

        app.controller('scroll to point of attention')(view, function () {
          app.controller('show')(details);
        });

        // promoted bar

        details.find('.progress-bar')
          .css('width', Math.floor(item.promotions * 100 / item.views) + '%')
          .text(Math.floor(item.promotions * 100 / item.views) + '%');

        // mail a friend

        var link = window.location.protocol + '//' + window.location.hostname +
          '/item/' + item._id + '/' + require('string')(item.subject).slugify();

        details.find('.invite-people-body').attr('placeholder',
          details.find('.invite-people-body').attr('placeholder') +
          link);

        details.find('.invite-people').attr('href',
          'mailto:?subject=' + item.subject + '&body=' +
          (details.find('.invite-people-body').val() ||
          details.find('.invite-people-body').attr('placeholder')) +
          "%0A%0A" + ' Synaccord - ' + link);

        // Votes and feedbacks

        Socket.emit('get item details', item);

        Socket.once('got item details', function (itemDetails) {

          itemDetails.criterias.forEach(function (criteria, index) {
            app.render('details votes', [itemDetails, index],
              function (detailsView) {
                detailsView.removeClass('template-model');
                details.find('.details-votes').append(detailsView);
              });
          });

          if ( itemDetails.feedbacks.length ) {
            itemDetails.feedbacks.forEach(function (feedback) {
              app.render('details feedback', feedback,
                function (feedbackView) {
                  feedbackView.removeClass('template-model');
                  details.find('.details-feedbacks').append(feedbackView);
                });
            });
          }

          else {
            details.find('.details-feedbacks h4').css('display', 'none');
          }

        });

      });

      // ITEM TOGGLE SUB PANEL

      view.find('.toggle-arrow i.fa').on('click', function () {
        
        var children = synapp['item relation'][item.type];

        if ( typeof children === 'string' ) {
          app.model('panels').push({
            type: children,
            parent: item._id,
            size: synapp['navigator batch size'],
            skip: 0
          });
        }

        else if ( Array.isArray(children) ) {
          children.forEach(function (child) {
            if ( typeof child === 'string' ) {
              app.model('panels').push({
                type: child,
                parent: item._id,
                size: synapp['navigator batch size'],
                skip: 0
              });
            }

            else if ( Array.isArray(child) ) {
              child.forEach(function (c) {
                app.model('panels').push({
                  type: c,
                  parent: item._id,
                  size: synapp['navigator batch size'],
                  skip: 0,
                  split: true
                });
              });
            }
          });
        }
      });

      // IS IN

      if ( synapp.user ) {
        view.find('.is-in').css('visibility', 'visible');
      }
    }
  };

} ();
