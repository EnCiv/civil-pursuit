;(function () {

  return false;

  module.exports = function ellipsis () {

    $(this).each(function () {
      var box = this;

      /** Exit if box has already been ellipsed */

      if ( $(box).hasClass('is-ellipsis') ) {
        return;
      }

      $(box).addClass('is-ellipsis');

      var height = $(box).find('.item-text').height();

      var readmore = $('<span class="readmore">[ <a href="#">more</a> ]</span>');

      // readmore.find('a').text(height)

      var readless = $('<div class="readless hide text-center">[ <a href="#">less</a> ]</div>');

      readmore.find('a').on('click', function () {
        $(box).find('.item-text').trigger('destroy');
        readless.removeClass('hide');
        $(box).find('.item-text').css('max-height', '100000px !important')
      });

      readmore.insertAfter($(box).find('.description'));

      readless.insertAfter($(box).find('.item-text'));

      var dotdotdot = {
        ellipsis: '... ',
        wrap: 'word',
        fallBackToLetter: true,
        watch: false,
        tolerance: 0,
        // callback: console.log.bind(console),
        height: height,
        after: "span.readmore"
      };

      var info_apply = new (function ellipse_apply () {
        this.subject = $(box).find('.item-title').text();

        this.type = $(box).closest('.panel').find('.panel-title').text();
        
        this.height = height;
      })();

      console.info(info_apply);

      $(box).find('.item-text').dotdotdot(dotdotdot);

      readless.find('a').on('click', function () {
        $(box).find('.item-text').dotdotdot(dotdotdot);
        readless.addClass('hide');
      });
    });
  };

})();