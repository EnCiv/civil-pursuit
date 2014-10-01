//- .synapp-url2title

module.exports = function ($http) {
  return {
    restrict: 'C',

    link: function ($scope, $elem, $attr) {

      $scope.searchingTitle = false;

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

            $scope.editor.url = $elem.val();

            $scope.editor.title = JSON.parse(data);

            $elem.data('url', $scope.editor.url);
            $elem.data('title', $scope.editor.title);
          });
      });
    }
  };
};
