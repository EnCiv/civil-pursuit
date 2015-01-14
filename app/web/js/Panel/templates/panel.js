! function () {

  'use strict';

  module.exports = {
    url: '/partial/panel',
    
    controller: function (view, panel) {

      var app = this;

      var Socket = app.importer.emitter('socket');

      var id = 'panel-' + panel.type;

      if ( panel.parent ) {
        id += '-' + panel.parent;
      }

      view.attr('id', id);

      if ( panel.split ) {
        view.addClass('split-view');
      }

      view.find('.panel-title').text(panel.type);

      view.find('.creator').eq(0).addClass(panel.type);

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
          Socket.emit('get items', _panel[0]);
        }

        return false;
      });

      view.find('.toggle-creator').on('click', function () {
        app.controller('reveal')(view.find('.creator'), view);
      });

      // enable file upload

      app.controller('upload')(view.find('.creator:eq(0) .drop-box'));

      // url title fecther

      view.find('.reference').on('change', function () {
        var board = $('.reference-board');
        var reference = $(this);

        board.removeClass('hide').text('Looking up');

        Socket.emit('get url title', $(this).val(),
          function (error, ref) {
            if ( ref.title ) {
              board.text(ref.title);
              reference.data('title', ref.title);

              var yt = app.controller('youtube')(ref.url);

              if ( yt ) {
                view.find('.creator').eq(0).find('.item-media')
                  .empty()
                  .append(yt);
              }
            }
            else {
              board.text('Looking up')
                .addClass('hide');
            }
          });
      });

    }
  };

} ();
