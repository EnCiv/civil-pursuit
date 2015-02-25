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
    $item.find('.item-description').text('');

    spanify(item.description).forEach(function (word) {
      $item.find('.item-description').append(word);
    });

    var limit = $item.find('.item-media img').height();

    var top = $item.find('.item-text').offset().top;

    if ( $('body').width() >= $('#screen-tablet').width() ) {
      if ( $item.attr('id') !== 'intro' ) {
        top -= ($item.find('.item-subject').height());
      }

      else {
        top -= 40;
      }
    }
    else if ( $('body').width() >= $('#screen-phone').width() ) {
      limit *= 2;
    }

    for ( var i = $item.find('.item-description .word').length - 1; i >= 0; i -- ) {
      var word = $item.find('.item-description .word').eq(i);

      if ( (word.offset().top - top) > limit ) {
        word.addClass('hidden-word').hide();
      }
    }

    if ( $item.find('.item-description .hidden-word').length ) {
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

    $item.find('.item-description').append(more);
  }

  module.exports = readMore;

} ();
