module.exports = function (EntryFactory) {
  return {
    restrict: 'C',
    link: function ($scope, $elem, $attrs) {

      var entry = $attrs.entry;

      EntryFactory.findById(entry)

        .success(function (data) {
          $scope.entry = data.found;
        });
    }
  };
};