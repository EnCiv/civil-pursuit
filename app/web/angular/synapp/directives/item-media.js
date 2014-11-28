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
        
        var youtube = require('../lib/youtube')($scope.url);

        /** Url is a Youtube URL */

        if ( youtube ) {
          $elem.append(youtube);
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
