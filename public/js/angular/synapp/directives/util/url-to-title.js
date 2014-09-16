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

            $scope.entry.url = $elem.val();

            $scope.entry.title = JSON.parse(data);

            $elem.data('url', $scope.entry.url);
            $elem.data('title', $scope.entry.title);
          });
      });

  /*    $elem.on('focus', function () {
        if ( $(this).data('url') && $(this).data('title') ) {
          $(this).val($(this).data('url'));
        }
      });

      $elem.on('blur', function () {
        if ( $(this).data('changing') === 'yes' ) {
          return;
        }

        if ( $(this).data('url') && $(this).data('title') ) {
          $(this).val($(this).data('title'));
        }
      });*/
    }
  };
};
