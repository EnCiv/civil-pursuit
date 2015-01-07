! function () {

  'use strict';

  function createItem () {
    var app = this;

    $('.creator').find('.button-create').on('click',
      function () {
        console.warn('hello')
        var creator = $(this).closest('.creator');

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
      });
  }

  module.exports = createItem;

} ();
