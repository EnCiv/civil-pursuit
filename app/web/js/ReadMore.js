! function () {
  
  'use strict';

  function spanify (des) {

    return des.replace(/\n/g, "\n ").split(' ')

      .map(function (word) {
        var span = $('<span class="word"></span>');
        span.text(word + ' ');
        return span;
      });
  }

  function readMore (item, $item) {

    /** {HTMLElement} Description wrapper in DOM */

    var $description    =     $item.find('.item-description');

    /** {HTMLElement} Image container in DOM */

    var $image          =     $item.find('.item-media img');

    /** {HTMLElement}  Text wrapper (Subject + Description + Reference) */

    var $text           =     $item.find('.item-text');

    /** {HTMLElement} Subject container in DOM */

    var $subject        =     $item.find('.item-subject')

    /** {Number} Image height */

    var imgHeight       =     $image.height();

    // If screen >= phone, then divide imgHeight by 2

    if ( $('body').width() >= $('#screen-tablet').width() ) {
      imgHeight *= 2;
    }

    /** {Number} Top position of text wrapper */

    var top             =     $text.offset().top;

    // If screen >= tablet

    if ( $('body').width() >= $('#screen-tablet').width() ) {

      // If intro

      if ( $item.attr('id') !== 'intro' ) {

        // Subtract height of subject from top
        
        top -= $subject.height();
      }

      // Subtract 40 pixels from top

      else {
        top -= 40;
      }
    }

    // Clear description

    $description.text('');

    // Spanify each word

    spanify(item.description).forEach(function (word) {
      $description.append(word);
    });

    // Hide words that are below limit

    for ( var i = $description.find('.word').length - 1; i >= 0; i -- ) {
      var word = $description.find('.word').eq(i);

      if ( (word.offset().top - top) > imgHeight ) {
        word.addClass('hidden-word').hide();
      }
    }

    if ( $description.find('.hidden-word').length ) {
      var more = $('<a href="#" class="more">more</a>');

      more.on('click', function () {

        if ( $(this).hasClass('more') ) {
          $(this).removeClass('more').addClass('less').text('less');
          $(this).closest('.item-description').find('.hidden-word').show();
        }

        else {
          $(this).removeClass('less').addClass('more').text('more');
          $(this).closest('.item-description').find('.hidden-word').hide();
        }

        return false;

      });
    }

    $description.append(more);
  }

  module.exports = readMore;

} ();
