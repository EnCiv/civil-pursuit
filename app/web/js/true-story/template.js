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

        new (require('./controllers/truncate'))(view);
      }
    },

    "item": {
      url: '/partial/item',
      controller: function (view, item) {
        view.find('.item-title').text(item.subject);
      }
    }
  
  };

}();
