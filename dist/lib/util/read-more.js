'use strict';

!(function () {

  'use strict';

  function spanify(des) {

    var div = ' <div---class="syn-lb"></div> ';

    return des.replace(/\n/g, div).split(/\s/).map(function (word) {
      if (word === div.trim()) {
        return $(div.trim().replace(/\-\-\-/g, ' '));
      }

      var span = $('<span class="word"></span>');
      span.text(word + ' ');
      return span;
    });
  }

  function readMore(model, view) {

    /** {HTMLElement} Description wrapper in DOM */

    var $description = view.querySelector('.item-description');

    /** {HTMLElement} Image container in DOM */

    var $image = view.querySelector('.item-media img');

    if (!$image.length) {
      $image = view.querySelector('.item-media iframe');
    }

    /** {HTMLElement}  Text wrapper (Subject + Description + Reference) */

    var $text = view.querySelector('.item-text');

    /** {HTMLElement} Subject container in DOM */

    var $subject = view.querySelector('.item-subject');

    /** {HTMLElement} Reference container in DOM */

    var $reference = view.querySelector('.item-reference');

    /** {HTMLElement} Arrow container in DOM */

    var $arrow = view.querySelector('.item-arrow');

    /** {Number} Image height */

    var imgHeight = $image.height();

    // If screen >= phone, then divide imgHeight by 2

    if ($('body').width() <= $('#screen-tablet').width()) {
      imgHeight *= 2;
    }

    /** {Number} Top position of text wrapper */

    var top = $text.offsetTop;

    // If **not** #intro, then subtract subject's height

    if (view.attr('id') !== 'intro') {

      // Subtract height of subject from top

      top -= $subject.height();
    }

    // If screen >= tablet

    if ($('body').width() >= $('#screen-tablet').width()) {
      // Subtract 40 pixels from top

      top -= 40;
    }

    // If screen >= phone

    else if ($('body').width() >= $('#screen-phone').width()) {
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

    for (var i = $description.querySelector('.word').length - 1; i >= 0; i--) {
      var word = $description.querySelector('.word').eq(i);
      // console.log(Math.ceil(word.offset().top), Math.ceil(top),
      //   { word: Math.ceil(word.offset().top - top), top: top, imgHeight: imgHeight, limit: Math.ceil(imgHeight), hide: (word.offset().top - top) > imgHeight })
      if (word.offset().top - top > imgHeight) {
        word.addClass('hidden-word').hide();
      }
    }

    if ($description.querySelector('.hidden-word').length) {
      var more = $('<a href="#" class="more">more</a>');

      more.on('click', function () {

        if ($(this).hasClass('more')) {
          $(this).removeClass('more').addClass('less').text('less');
          $(this).closest('.item-description').querySelector('.hidden-word').show();
        } else {
          $(this).removeClass('less').addClass('more').text('more');
          $(this).closest('.item-description').querySelector('.hidden-word').hide();
        }

        return false;
      });

      $description.append(more);
    }
  }

  module.exports = readMore;
})();