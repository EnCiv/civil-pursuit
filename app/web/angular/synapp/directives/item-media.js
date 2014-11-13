;(function () {

  module.exports = [ItemMedia];

  function ItemMedia () {
    return {
      restrict: 'C',
      scope: {
        url:    '@',
        filter: '@',
        image:  '@',
        upload: '@'
      },
      link: function ($scope, $elem) {
        var regexYouTube = /youtu\.?be.+v=([^&]+)/;

        /** Url is a Youtube URL */

        if ( $scope.url && regexYouTube.test($scope.url) ) {
          var youtube;
          $scope.url.replace(regexYouTube, function (m, v) {
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
          $elem.append(container);
        }

        /** There is an image */

        else if ( $scope.image && /cloudinary/.test($scope.image) ) {
          var image = $('<img />');
          image.addClass('img-responsive');
          image.attr('src', $scope.image);
          $elem.append(image);
        }

        /** There is an uploaded image */
        
        else if ( $scope.upload ) {
          var image = $('<img />');
          image.addClass('img-responsive');
          image.attr('src', $scope.upload);
          $elem.append(image);
        }
      }
    };
  }

})();
