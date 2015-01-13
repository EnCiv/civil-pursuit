! function () {

  'use strict';

  function createItem () {
    var app = this;

    var Socket = app.importer.emitter('socket');

    $('.creator').find('.button-create').on('click',
      function onClickingCreateButton () {

        var creator     =   $(this).closest('.creator');

        var panel       =   $(this).closest('.panel');

        var panelId     =   panel.attr('id').split('-');

        var subject     =   creator.find('[name="subject"]');

        var description =   creator.find('[name="description"]');
        
        var reference   =   creator.find('[name="reference"]');

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
            user:         synapp.user,
            subject:      subject.val(),
            description:  description.val(),
            type:         panelId[1],
            references:   [
              {
                url:          reference.val(),
                title:        reference.data('title')
              }
            ]
          };

          if ( panelId[2] ) {
            item.parent = panelId[2];
          }

          if ( creator.find('.preview-image').length ) {
            item.image = creator.find('.preview-image').attr('src');
          }

          if ( item.image ) {
            // Socket.emit('upload image', creator.find('.preview-image').data('file'));

            var file = creator.find('.preview-image').data('file');

            var stream = ss.createStream();

            ss(Socket).emit('upload image', stream,
              { size: file.size, name: file.name });
            
            ss.createBlobReadStream(file).pipe(stream);

            stream.on('end', function () {
              item.image = file.name;
              Socket.emit('create item', item);
            });
          }

          else {
            console.warn('yoohoo')
            Socket.emit('create item', item);
          }

          subject.val('');
          description.val('');
          reference.val('');
        }
      });
  
    Socket.on('created item', function (item) {
      console.warn('item created')
      item.is_new = true;
      
      app.model('items').push(item);
    });
  }

  module.exports = createItem;

} ();
