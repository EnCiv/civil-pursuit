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
        app.emitter('socket').emit('get items', panel);
        return false;
      });

      view.find('.toggle-creator').on('click', function () {
        app.controller('reveal')(view.find('.creator'), view);
      });

    }
  };

} ();
