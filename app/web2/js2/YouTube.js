! function () {

  'use strict';

  function YouTube (url) {
    var self = this;

    var youtube;

    var regexYouTube = /youtu\.?be.+v=([^&]+)/;

    if ( regexYouTube.test(url) ) {
      url.replace(regexYouTube, function (m, v) {
        youtube = v;
      });

      var raw = '<div class="youtube-preview" data-video="' + youtube + '"><img alt="YouTube" src="http://img.youtube.com/vi/' + youtube + '/hqdefault.jpg" class="img-responsive youtube-thumbnail" /><div class="icon-play"><i class="fa fa-youtube-play fa-5x"></i></div></div>';

      var elem = $(raw);

      Play(elem);

      return elem;
    }
  }

  function Play (elem) {
    setTimeout(function () {
      var img   =   elem.find('img');

      var icon  =   elem.find('.icon-play');

      icon.css('width', img.width() + 'px');

      icon.css('height', img.height() + 'px');

      img.css('margin-bottom', '-' + img.height() + 'px');

      $(window).on('resize', function () {

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
        
    }, 800);
  }

  module.exports = YouTube;

} ();
