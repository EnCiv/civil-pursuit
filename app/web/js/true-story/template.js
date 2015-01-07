! function () {

  'use strict';

  function reveal (elem, poa) {
    if ( ! elem.hasClass('is-toggable') ) {
      elem.addClass('is-toggable');
    }

    if ( elem.hasClass('is-showing') || elem.hasClass('is-hiding') ) {
      return false;
    }

    elem.removeClass('is-hidden').addClass('is-showing');

    app.controller('scroll to point of attention')(poa, function () {
      app.controller('show')(elem);
      // elem.css('display', 'block');
    });
  }

  module.exports = {
    
    "online users": {
      template:     '.online-users',
      
      controller:   function (view, online_users) {
        view.text(online_users);
      }
    },

    "sign": {
      
    },

    "panel": {
      url:          '/partial/panel',
      
      controller:   function (view, panel) {

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

        view.find('.toggle-creator').on('click', function () {
          reveal(view.find('.creator'), view);
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

        });

        // IS IN

        if ( synapp.user ) {
          view.find('.is-in').css('visibility', 'visible');
        }
      }
    },

    "evaluation": {
      template: '.evaluator',
      controller: function (view, evaluation) {
        var itemID = '#item-' + evaluation.item;

        var item = $(itemID);

        item.find('.evaluator .cursor').text(evaluation.cursor); 
        item.find('.evaluator .limit').text(evaluation.limit);

        for ( var i = 0; i < 2; i ++ ) {

          item.find('.evaluator .image:eq(' + i +')').append(
            app.controller('item media')(evaluation.items[i]));

          item.find('.evaluator .subject:eq(' + i +')').text(
            evaluation.items[i].subject);

          item.find('.evaluator .description:eq(' + i +')').text(
            evaluation.items[i].description);

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

            app.render(template, {});

            app.on('rendered ' + template_name, function (view) {
              view.css('display', 'block');
              item.find('.evaluator .sliders:eq(' + this.index + ')').append(view);
            }.bind({ index: i }));
          });
        }
      }
    }
  
  };

}();
