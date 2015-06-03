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

    if ( ! $image.length ) {
      $image            =     $item.find('.item-media iframe');
    }

    /** {HTMLElement}  Text wrapper (Subject + Description + Reference) */

    var $text           =     $item.find('.item-text');

    /** {HTMLElement} Subject container in DOM */

    var $subject        =     $item.find('.item-subject');

    /** {HTMLElement} Reference container in DOM */

    var $reference      =     $item.find('.item-reference');

    /** {HTMLElement} Arrow container in DOM */

    var $arrow          =     $item.find('.item-arrow')

    /** {Number} Image height */

    var imgHeight       =     $image.height();

    // If screen >= phone, then divide imgHeight by 2

    if ( $('body').width() <= $('#screen-tablet').width() ) {
      imgHeight *= 2;
    }

    /** {Number} Top position of text wrapper */

    var top             =     $text.offset().top;

    // If **not** #intro, then subtract subject's height

    if ( $item.attr('id') !== 'intro' ) {

      // Subtract height of subject from top
      
      top -= $subject.height();
    }

    // If screen >= tablet

    if ( $('body').width() >= $('#screen-tablet').width() ) {
      // Subtract 40 pixels from top

      top -= 40;
    }

    // If screen >= phone

    else if ( $('body').width() >= $('#screen-phone').width() ) {
      top -= 80;
    }

    // console.info( item.subject.substr(0, 30) + '...', 'top', Math.ceil(top), ',', Math.ceil(imgHeight) );

    // Clear description

    $description.text('');

    // Spanify each word

    spanify(item.description).forEach(function (word) {
      $description.append(word);
    });

    // Hide words that are below limit

    for ( var i = $description.find('.word').length - 1; i >= 0; i -- ) {
      var word = $description.find('.word').eq(i);
      // console.log(Math.ceil(word.offset().top), Math.ceil(top),
      //   { word: Math.ceil(word.offset().top - top), top: top, imgHeight: imgHeight, limit: Math.ceil(imgHeight), hide: (word.offset().top - top) > imgHeight })
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

      $description.append(more);
    }

    // Hide reference if too low and breaks design

    if ( $reference.text() && (($arrow.offset().top - $reference.offset().top) < 15 ) ) {

      var more;

      if ( $description.find('.more').length ) {
        more = $description.find('.more');
      }

      else {
        more = $('<a href="#" class="more">more</a>');

        more.on('click', function () {

          if ( $(this).hasClass('more') ) {
            $(this).removeClass('more').addClass('less').text('less');
            $reference.show();
          }

          else {
            $(this).removeClass('less').addClass('more').text('more');
            $reference.hide();
          }

          return false;

        });
      }

      $description.append(more);

      $reference
        .css('padding-bottom', '10px')
        .data('is-hidden-reference', true)
        .hide();
    }
  }

  module.exports = readMore;

} ();
