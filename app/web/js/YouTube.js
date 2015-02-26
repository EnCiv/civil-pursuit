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

      var div = $('<div></div>');

      div.addClass('youtube-preview');

      div.data('video', youtube);

      var img = $('<img>');

      img.attr({
        alt: 'YouTube',
        src: 'http://img.youtube.com/vi/' + youtube + '/hqdefault.jpg'
      });

      img.addClass('img-responsive youtube-thumbnail');

      var button = $('<button></button>');

      button.addClass('icon-play danger');

      var i = $('<i></i>');

      i.addClass('fa fa-youtube-play fa-3x');

      // var raw = '<div class="youtube-preview" data-video="' + youtube + '"><img alt="YouTube" src="http://img.youtube.com/vi/' + youtube + '/hqdefault.jpg" class="img-responsive youtube-thumbnail" /><button class="icon-play hide"><i class="fa fa-youtube-play fa-3x"></i></button></div>';

      // var elem = $(raw);

      button.append(i);

      div.append(img, button);

      Play(div);

      return div;
    }
  }

  function Play (elem) {

    var img   =   elem.find('img');

    var icon  =   elem.find('.icon-play');

    icon.removeClass('hide');

    img.on('load', function () {
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
    });

    setTimeout(function () {


      return;

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
