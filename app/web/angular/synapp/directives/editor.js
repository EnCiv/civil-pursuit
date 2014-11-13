;(function () {

  module.exports = ['DataFactory', Editor];

  function Editor (DataFactory) {
    return {
      restrict: 'C',
      templateUrl: '/templates/editor',
      controller: ['$scope', function ($scope) {
        $scope.save = function () {
          DataFactory.Item.update($scope.item._id, {
            subject: $scope.item.subject,
            description: $scope.item.description,
            image: (function () {
              if ( Array.isArray($scope.$root.uploadResult) && $scope.$root.uploadResult.length ) {
                  return $scope.$root.uploadResult[0].path.split(/\//).pop();
                }
            })()
          });
        };
      }]
    };
  }
})();
