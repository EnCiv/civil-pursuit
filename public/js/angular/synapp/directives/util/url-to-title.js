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

            $scope.editor.references[0].url = $elem.val();

            $scope.editor.references[0].title = JSON.parse(data);

            $elem.data('url', $scope.editor.references[0].url);
            $elem.data('title', $scope.editor.references[0].title);
          });
      });
    }
  };
};
