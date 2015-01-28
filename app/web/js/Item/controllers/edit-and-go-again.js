! function () {

  'use strict';

  function editAndGoAgain (view, item) {

    var app = this;

    var $item = view.find('>.item');

    $item.find('[name="subject"]').val(item.subject);
    $item.find('[name="description"]').val(item.description);

    if ( item.references.length ) {
      $item.find('[name="reference"]').val(item.references[0].url);
    }

    $item.find('.item-media-wrapper')
      .empty()
      .append(
        this.controller('item media')(item));

    $item.find('.button-create').on('click', function () {

      var $editor      =   $(this).closest('.editor');

      // Subject field

      var $subject      =   $editor.find('[name="subject"]');

      // Description field

      var $description  =   $editor.find('[name="description"]');

      // Reference field
      
      var $reference    =   $editor.find('[name="reference"]');

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
        var _item = item;

        _item.from = item._id;
        _item.subject = $subject.val();
        _item.description = $description.val();
        _item.references = [{
          url: $reference.val()
        }];

        delete _item._id;

        app.importer.emitter('socket').emit('edit and go again', _item,
          function (error, new_item) {
            if ( error ) {

            }
            else {
              new_item.is_new = true;

              app.importer.extension('Panel').controller('hide')(
                $editor, function () {
                  app.push('items', new_item);
                });
            }
          });
      }
    });

  };

  module.exports = editAndGoAgain;

} ();
