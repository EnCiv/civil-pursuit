! function () {

  'use strict';

  function create () {

    console.info(this)

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
  }

  module.exports = create;

} ();
