;(function () {

  function youtube (url) {
    var regexYouTube = /youtu\.?be.+v=([^&]+)/;

    if ( url && regexYouTube.test(url) ) {
      var youtube;
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

    return false;
  }

  module.exports = youtube;

})();