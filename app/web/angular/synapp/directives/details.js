;(function () {

  module.exports = [Details];

  function Details () {
    return {
      restrict: 'C',
      link: function ($scope, $elem) {
        $scope.emailBody = "I'm helping to bring synergy to democracy by voicing my opinion. I'm participating in the topic: " + '"' + $scope.item.subject + '". Please join me at Synaccord ' + location.href;
      }
    };
  }

})();
