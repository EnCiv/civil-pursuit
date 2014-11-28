;(function () {

  module.exports = function ellipsis () {

    $(this).each(function () {
      var box = this;

      /** Exit if box has already been ellipsed */

      if ( $(box).hasClass('is-ellipsis') ) {
        return;
      }

      var media = (function getMedia () {
        var media = $(box).find('.item-media-wrapper:eq(0) .img-responsive:eq(0)');

        if ( media.length ) {
          return media;
        }

        return $(box).find('.item-media-wrapper:eq(0) iframe');
      })();

      var height = media.height() || media.css('height');

      var info_candidate = new (function ellipse_candidate () {
        this.subject = $(box).find('.item-title').text();

        this.type = $(box).closest('.panel').find('.panel-title').text();
        
        this.media = media[0].nodeName;

        this.height = height;

        this.refreshed = box.refreshed
      })();

      console.info(info_candidate);

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

      if ( height < 100 ) {
        height += 20;
      }

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
        watch: false,
        tolerance: 0,
        // callback: console.log.bind(console),
        height: height,
        after: "span.readmore"
      };

      var info_apply = new (function ellipse_apply () {
        this.subject = $(box).find('.item-title').text();

        this.type = $(box).closest('.panel').find('.panel-title').text();
        
        this.media = media[0].nodeName.toLowerCase();

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