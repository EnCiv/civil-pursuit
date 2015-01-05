; ! function () {

  'use strict';

  var regexYouTube = /youtu\.?be.+v=([^&]+)/;

  function youTubePreview (url) {
    var youtube;

    if ( regexYouTube.test(url) ) {
      url.replace(regexYouTube, function (m, v) {
        youtube = v;
      });
      var container = $('<div></div>');
      container.addClass('video-container');
      var iframe = $('<iframe></iframe>');
      iframe.attr('src', 'http://www.youtube.com/embed/' + youtube);
      iframe.attr('frameborder', '0');
      iframe.attr('width', 560);
      iframe.attr('height', 315);
      container.append(iframe);

      return container;
    }
  }

  module.exports = youTubePreview;

}();
