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

            $scope.item.references[0].url = $elem.val();

            $scope.item.references[0].title = data;

            $elem.data('url', $scope.item.references[0].url);
            $elem.data('title', $scope.item.references[0].title);
          });
      });
    }
  };
}
