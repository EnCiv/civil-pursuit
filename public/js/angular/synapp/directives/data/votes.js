module.exports = function (VoteFactory) {
  return {
    restrict: 'C',
    link: function ($scope, $elem, $attr ) {
      if ( $attr.entry ) {
        VoteFactory.getAccumulation($attr.entry)

          .success(function (data) {
            $scope.votes = data;
            console.log(data);
          });
      }
    }
  };
};