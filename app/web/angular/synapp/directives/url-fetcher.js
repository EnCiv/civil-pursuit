/**
 * `getUrlTitle` Attempt to fetch a title from URL and inject back results to scope
 * 
 * @module synapp
 * @function directive::get-url-title
 * @return {AngularDirective}
 * @example
 *    <INPUT data-syn-get-url-title />
 * @author francoisrvespa@gmail.com
*/

;(function () {
  module.exports = ['$http', getUrlTitle];

  function getUrlTitle ($http) {
    return {
      restrict: 'CA',

      link: function ($scope, $elem, $attr) {

        /** */

        $scope.searchingTitle = false;

        /** */

        $elem.on('change', function () {

          $scope.searchingTitle = true;

          $scope.searchingTitleFailed = false;

          $(this).data('changing', 'yes');

          $http.post('/tools/get-title', { url: $(this).val() })
            
            .error(function (error) {
              $scope.searchingTitleFailed = true;

              $scope.searchingTitle = false;
            })
            
            .success(function (data) {

              $elem.data('changing', 'no');

              $scope.searchingTitle = false;

              $elem.closest('.description').find('[name="url"]').val($elem.val());

              $elem.data('url', $elem.val());
              $elem.data('title', data);
              $elem.val(data);

              var youtube = require('../lib/youtube')(data);

              if ( youtube ) {
                $elem.closest('.editor,.creator').find('.item-media')
                  .addClass('youtube')
                  .empty().append(youtube);
              }
            });
        });
      }
    };
  }
})();
