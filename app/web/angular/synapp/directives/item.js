;(function () {

  function isVisible (elem) {

    var parent = { elem: elem.parent() };

    parent.top = parent.elem.offset().top;

    parent.height = parent.elem.outerHeight();

    var child = { elem: elem };

    child.top = elem.offset().top;

    return (parent.top + parent.height) > child.top;
  }

  module.exports = ['$rootScope', '$timeout', Item];

  function Item ($rootScope, $timeout) {
    return {
      restrict: 'C',
      controller: ['$scope', function ($scope) {

        $scope.loaded = {};

        return;

        $scope.$watch('$show', function (show, _show) {
          if ( show && show !== _show ) {
            console.log('show', show, $scope.loaded[show])

            if ( show === 'evaluator' ) {
              $scope.$root.loadEvaluation($scope.item._id);
            }

            else if ( ! $scope.loaded[show] ) {
              switch ( show ) {
                case 'children':
                  $scope.loaded.children = true;
                  $scope.$parent.loadChildren($scope.item._id);
                  break;

                case 'details':
                  $scope.loaded.details = true;
                  $scope.$root.loadDetails($scope.item._id);
                  break;
              }
            }
          }
        });
      }],
      link: function ($scope, $elem, $attr) {
        $scope.isSplit = ['Agree', 'Disagree', 'Pro', 'Con']
          .indexOf($scope.item.type) > -1;

        $timeout(function () {
          $scope.$root.truncate($elem);
        });
      }
    };
  }
})();
