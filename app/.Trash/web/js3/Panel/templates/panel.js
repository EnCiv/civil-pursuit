! function () {

  'use strict';

  module.exports = {
    url: '/partial/panel',
    
    controller: function (view, panel) {

      var app = this;

      var Socket = app.importer.emitter('socket');

      // DOM elements

      var $creator = view.find('>.panel-body >.creator');

      // Set panel ID

      var id = 'panel-' + panel.type;

      if ( panel.parent ) {
        id += '-' + panel.parent;
      }

      view.attr('id', id);

      // Add type as class

      view.addClass('type-' + panel.type);

      // Split panel

      if ( panel.split ) {
        view.addClass('split-view');
      }

      // Panel heading - type is title

      view.find('.panel-title').eq(0).text(panel.type);

      // Add type as class

      $creator.addClass(panel.type);

      // Load more - be verbose about type

      view.find('.load-more a').text(
        view.find('.load-more a').text() + ' ' +
          synapp.plurals[panel.type.toLowerCase()]);

      // Load more

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

      // Toggle creator view

      view.find('.toggle-creator').on('click', function () {
        if ( $creator.hasClass('is-showing') || $creator.hasClass('is-hiding') ) {
          return;
        }
        else if ( $creator.hasClass('is-shown') ) {
          app.controller('hide')($creator);
        }
        else {
          app.controller('reveal')($creator, view);
        }
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

      // On create item
      $creator
        
        .find('.button-create')
        
        .on('click', function onClickingCreateButton () {

          // Overscoping $creator

          var $creator      =   $(this).closest('.creator');

          // Identify Panel

          var $panel        =   $(this).closest('.panel');

          // Panel ID split to easily get panel parent(1) and panel type(2)

          var panelId       =   $panel.attr('id').split('-');

          // Subject field

          var $subject      =   $creator.find('[name="subject"]');

          // Description field

          var $description  =   $creator.find('[name="description"]');

          // Reference field
          
          var $reference    =   $creator.find('[name="reference"]');

          // Reset errors in case of any from previous call

          $subject.removeClass('error');

          $description.removeClass('error');

          // Subject empty? Trigger visual error

          if ( ! $subject.val() ) {
            $subject.addClass('error').focus();
          }

          // Description empty? Trigger visual error

          else if ( ! $description.val() ) {
            $description.addClass('error').focus();
          }

          // No Errors? Proceed to back-end transmission

          else {

            // Building item to send

            var item = {
              user:         synapp.user,
              subject:      $subject.val(),
              description:  $description.val(),
              type:         panelId[1],
              references:   [
                {
                  url:          $reference.val(),
                  title:        $reference.data('title')
                }
              ]
            };

            // If item has parent

            if ( panelId[2] ) {
              item.parent = panelId[2];
            }

            // If item has image

            if ( $creator.find('.preview-image').length ) {
              item.image = $creator.find('.preview-image').attr('src');
            }

            // If item image, stream upload first the image
            // and then emit to socket create item

            if ( item.image ) {

              var file = $creator.find('.preview-image').data('file');

              var stream = ss.createStream();

              ss(Socket).emit('upload image', stream,
                { size: file.size, name: file.name });
              
              ss.createBlobReadStream(file).pipe(stream);

              stream.on('end', function () {
                item.image = file.name;
                Socket.emit('create item', item);
              });
            }

            // emit to socket to create item

            else {
              Socket.emit('create item', item);
            }

            // Cleaning form

            $subject.val('');
            $description.val('');
            $reference.val('');
          }
        })

    }
  };

} ();
