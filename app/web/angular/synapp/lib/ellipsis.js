;(function () {

  module.exports = function ellipsis () {

    $(this).each(function () {
      var box = this;

      if ( $(box).hasClass('is-ellipsis') ) {
        return;
      }

      var media = $(box).find('.item-media-wrapper:eq(0) .img-responsive');

      if ( ! media.length ) {
        media = $(box).find('.item-media-wrapper').find('iframe');
      }

      var height = media.height() || media.css('height');

      console.log('aaaaaaa', $(box).find('.item-title').text(), media.length,
        $(box).find('.item-media-wrapper:eq(0)').height());

      height = parseInt(height);

      if ( ! height || height < 50 ) {
        if ( isNaN(this.refreshed) ) {
          this.refreshed = 0;
        }

        if ( this.refreshed > 25 ) {
          height = 120;
        }

        else {
          this.refreshed ++;

          console.log('fffffff', $(box).find('.item-title').text(), media.length, height);

          return setTimeout(ellipsis.bind(box), 250);
        }
      }

      var height2 = $(box).find('.box-buttons').height() || $(box).find('.box-buttons').css('height');

      if ( height2 > height ) {
        height = height2 + 35;
      }

      if ( $(box).closest('.split-view').length ) {
        height *= 1.5;
      }

      $(box).addClass('ellipsis');

      console.log({
        subject: $(box).find('.item-title').text(),
        media: {
          has: !!media.length,
          is: media.length && media[0].nodeName,
          height: height
        }
      });

      var readmore = $('<span class="readmore">[ <a href="#">more</a> ]</span>');

      // readmore.find('a').text(height)

      var readless = $('<div class="readless hide text-center">[ <a href="#">less</a> ]</div>');

      readmore.find('a').on('click', function () {
        $(box).find('.item-text').trigger('destroy');
        readless.removeClass('hide');
      });

      readmore.insertAfter($(box).find('.description'));

      readless.insertAfter($(box).find('.item-text'));

      var dotdotdot = {
        ellipsis: '... ',
        wrap: 'word',
        fallBackToLetter: true,
        watch: true,
        tolerance: 5,
        // callback: console.log.bind(console),
        height: height,
        after: "span.readmore"
      };

      $(box).find('.item-text').dotdotdot(dotdotdot);

      readless.find('a').on('click', function () {
        $(box).find('.item-text').dotdotdot(dotdotdot);
        readless.addClass('hide');
      });
    });
  };

})();