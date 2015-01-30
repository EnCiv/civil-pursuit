; ! function () {

  'use strict';

  function youTubePlayIcon (view) {

    var div = this;

    setTimeout(function () {
      
      // view.find('.youtube-preview .icon-play').css('background',
      //   'url(' + view.find('.youtube-preview img').attr('src') + ')');

      var img = view.find('.youtube-preview img');

      var icon = view.find('.youtube-preview .icon-play');

      icon.css('width', img.width() + 'px');

      icon.css('height', img.height() + 'px');

      img.css('margin-bottom', '-' + img.height() + 'px');

      $(window).on('resize', function () {

        console.log('resizing')

        icon.css('width', img.width() + 'px');

        img.css('margin-bottom', '-' + img.height() + 'px');
      });

      icon.find('.fa').on('click', function () {
        var video_container = $('<div class="video-container"></div>');

        var preview = $(this).closest('.youtube-preview');

        preview
          .empty()
          .append(video_container);

        video_container.append($('<iframe frameborder="0" width="300" height="175" allowfullscreen></iframe>'));

        video_container.find('iframe')
          .attr('src', 'http://www.youtube.com/embed/'
            + preview.data('video') + '?autoplay=1'); 
      });

      icon.show();

      icon.css('padding-top',
        ( ( img.height() / 2 ) - ( icon.find('.fa').height() / 2 ) )
          + 'px');
        
    }, 1000);
  }

  module.exports = youTubePlayIcon;

}();
