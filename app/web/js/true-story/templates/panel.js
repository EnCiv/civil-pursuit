! function () {

  'use strict';

  module.exports = {
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
        var _panel = app.model('panels').filter(function (pan) {
          if ( pan.type !== panel.type ) {
            return false;
          }
          if ( panel.parent && panel.parent !== pan.parent ) {
            return false;
          }
          return true;
        });

        if ( _panel.length ) {
          app.emitter('socket').emit('get items', _panel[0]);
        }

        return false;
      });

      view.find('.toggle-creator').on('click', function () {
        app.controller('reveal')(view.find('.creator'), view);
      });

      // enable file upload

      app.controller('upload')(view.find('.creator:eq(0) .drop-box'));

    }
  };

} ();
