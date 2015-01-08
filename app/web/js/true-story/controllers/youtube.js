; ! function () {

  'use strict';

  var regexYouTube = /youtu\.?be.+v=([^&]+)/;

  function youTubePreview (url, server) {
    var youtube;

    if ( regexYouTube.test(url) ) {
      url.replace(regexYouTube, function (m, v) {
        youtube = v;
      });

      var raw = '<div class="video-container">' +
          '<iframe src="http://www.youtube.com/embed/' + youtube + '" frameborder="0" width="300" height="175"></iframe>' +
        '</div>';

      if ( server ) {
        return raw;
      }

      else {
        return $(raw);
      }
    }
  }

  module.exports = youTubePreview;

}();
