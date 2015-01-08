! function () {

  'use strict';

  module.exports = {
    url: '/partial/item',
    controller: function (view, item) {

      var app = this;

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

        app.controller('scroll to point of attention')(view, function () {
          app.controller('show')(evaluator);

          var evaluationExists = app.model('evaluations').some(function (evaluation) {
            return evaluation.item === item._id;
          });

          if ( ! evaluationExists ) {
            app.emitter('socket').emit('get evaluation', item);
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

        details.find('.progress-bar')
          .css('width', Math.floor(item.promotions * 100 / item.views) + '%')
          .text(Math.floor(item.promotions * 100 / item.views) + '%');

        // mail a friend

        details.find('.invite-people').attr('href',
          'mailto:?subject=' + item.subject + '&body=' +
          (details.find('.invite-people-body').val() ||
          details.find('.invite-people-body').attr('placeholder')));

      });

      // ITEM TOGGLE SUB PANEL

      view.find('.toggle-arrow i.fa').on('click', function () {
        console.warn('SUB #1 clicked');
        app.model('panels').push({
          type: 'Problem',
          parent: item._id,
          size: synapp['navigator batch size'],
          skip: 0
        });
      });

      // IS IN

      if ( synapp.user ) {
        view.find('.is-in').css('visibility', 'visible');
      }
    }
  };

} ();
