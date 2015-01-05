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
      }
    },

    "item": {
      url: '/partial/item',
      controller: function (view, item) {

        var hasMedia;
        var yt;

        view.attr('id', 'item-' + item._id);

        view.find('.item-title').text(item.subject);
        view.find('.description').text(item.description);

        // REFERENCES

        if ( item.references.length ) {
          view.find('.item-references').show();
          view.find('.item-references a')
            .attr('src', item.references[0].url)
            .text(item.references[0].title || item.references[0].url);

          yt = require('./controllers/youtube')(item.references[0].url);

          if ( yt ) {
            view.find('.item-media').append(yt);
            hasMedia = true;
          }
        }
        else {
          view.find('.item-references').hide();
        }

        // TRUNCATE

        new (require('./controllers/truncate'))(view);

        if ( item.image && ! hasMedia ) {
          yt = require('./controllers/youtube')(item.image);

          if ( yt ) {
            view.find('.item-media').append(yt);
          }

          else {
            view.find('.item-media').append(
              app.controller('bootstrap/responsive-image')({
                src: item.image
              }));
          }
        }
      }
    }
  
  };

}();
