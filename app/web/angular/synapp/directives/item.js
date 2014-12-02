;(function () {

  function isVisible (elem) {

    var parent = { elem: elem.parent() };

    parent.top = parent.elem.offset().top;

    parent.height = parent.elem.outerHeight();

    var child = { elem: elem };

    child.top = elem.offset().top;

    return (parent.top + parent.height) > child.top;
  }

  module.exports = ['$rootScope', '$timeout', 'Truncate', Item];

  function Item ($rootScope, $timeout, Truncate) {
    return {
      restrict: 'C',
      controller: ['$scope', function ($scope) {

        $scope.loaded = {};

      }],
      link: function ($scope, $elem, $attr) {
        $scope.isSplit = ['Agree', 'Disagree', 'Pro', 'Con']
          .indexOf($scope.item.type) > -1;

        $timeout(function () {
          new Truncate($elem);
        });
      }
    };
  }
})();
