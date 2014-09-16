module.exports = function ($scope) {
  $scope.selectMeAsTopic = function (topicId) {
    if ( $scope.selectedTopic === topicId ) {
      $scope.selectedTopic = null;
    }
    else {
      $scope.selectedTopic = topicId;
    }
  };

  $scope.viewEntrySummaryOnTouch = function (entryId) {
    location.href = '/summary/' + entryId;
  }

  $scope.getPromoted = function (entry) {
    if ( entry ) {
      return (entry.promotions * 100 / entry.views).toFixed(2);
    }
  }
};