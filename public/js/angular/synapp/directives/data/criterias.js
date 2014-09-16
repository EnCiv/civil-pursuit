module.exports = function (CriteriaFactory) {
  return {
    restrict: 'C',

    link: function ($scope, $elem, $attr) {

      CriteriaFactory.find()

        .success(function (criterias) {

          $scope.criterias = criterias;
        });

    }
  };
};