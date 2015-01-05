! function () {

  'use strict';

  module.exports = {
    
    "online users": {
      template: '.online-users',
      controller: function (view, online_users) {
        view.text(online_users);
      }
    },

    "panel": {
      url: '/partial/panel',
      controller: function (view, panel) {

        var app = this;

        var id = 'panel-' + panel.type;

        if ( panel.parent ) {
          id += '-' + panel.parent;
        }

        view.attr('id', id);

        view.find('.panel-title').text(panel.type);

        view.find('.load-more').on('click', function () {
          app.emitter('socket').emit('get items', panel);
          return false;
        });

      }
    },

    "intro": {
      template: '#intro',
      controller: function (view, intro) {
        var app = this;

        // view.find('.panel-title').text('intro.subject');
        $('#intro').find('.panel-title').text(intro.subject);
        $('#intro').find('.item-title').text(intro.subject);
        $('#intro').find('.description').text(intro.description);

        $('#intro').find('.item-media').append(
          app.controller('bootstrap/responsive-image')({
            src: intro.image
          }));

        $('#intro').find('.item-references').hide();

        new (require('./controllers/truncate'))($('#intro'));

        $('#intro').find('.promoted').hide();

        $('#intro').find('.box-buttons').hide();
      }
    },

    "item": {
      url: '/partial/item',
      controller: function (view, item) {

        var app = this;

        view.attr('id', 'item-' + item._id);

        view.find('.item-title').text(item.subject);
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

        new (require('./controllers/truncate'))(view);

        // ITEM MEDIA

        view.find('.item-media').append(
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

        // ITEM TOGGLE DETAILS

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
      }
    }
  
  };

}();
