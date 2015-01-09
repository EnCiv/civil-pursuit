! function () {

  'use strict';

  function createItem () {
    var app = this;

    $('.creator').find('.button-create').on('click',
      function () {
        var creator = $(this).closest('.creator');

        var panel = $(this).closest('.panel');

        var panelId = panel.attr('id').split('-');

        var subject = creator.find('[name="subject"]');
        var description = creator.find('[name="description"]');

        subject.removeClass('error');
        description.removeClass('error');

        if ( ! subject.val() ) {
          subject.addClass('error').focus();
        }

        else if ( ! description.val() ) {
          description.addClass('error').focus();
        }

        else {
          var item = {
            user: synapp.user,
            subject: subject.val(),
            description: description.val(),
            type: panelId[1]
          };

          if ( panelId[2] ) {
            item.parent = panelId[2];
          }

          if ( creator.find('.preview-image').length ) {
            item.image = creator.find('.preview-image').attr('src');
          }

          if ( item.image ) {
            // app.emitter('socket').emit('upload image', creator.find('.preview-image').data('file'));

            var file = creator.find('.preview-image').data('file');

            var stream = ss.createStream();

            ss(app.emitter('socket')).emit('upload image', stream,
              { size: file.size, name: file.name });
            
            ss.createBlobReadStream(file).pipe(stream);

            stream.on('end', function () {
              app.emitter('socket').emit('create item', item);
            });
          }

          else {
            app.emitter('socket').emit('create item', item);
          }
        }
      });
  
    app.emitter('socket').on('created item', function (item) {
      item.is_new = true;
      console.warn('created item');
      app.model('items').push(item);
    });
  }

  module.exports = createItem;

} ();
