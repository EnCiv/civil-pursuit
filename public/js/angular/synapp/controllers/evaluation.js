module.exports = function ($scope, EntryFactory, VoteFactory, FeedbackFactory) {

  $scope.votes = {};

  $scope.feedbacks = {};

  $scope.continue = function () {

    var entries = $scope.evaluation.entries;

    VoteFactory.add($scope.votes[entries[0]._id], entries[0]._id, $scope.email);

    console.log($scope.feedbacks);

    if ( $scope.feedbacks[entries[0]._id] ) {
      FeedbackFactory.create(entries[0]._id, $scope.email, $scope.feedbacks[entries[0]._id]);
    }

    if ( $scope.feedbacks[entries[1]._id] ) {
      FeedbackFactory.create(entries[1]._id, $scope.email, $scope.feedbacks[entries[1]._id]);
    }

    entries.splice(0, entries[1] ? 2 : 1);

    EntryFactory.view(entries[0]._id);

    if ( entries[1] && entries[1]._id ) {
      EntryFactory.view(entries[1]._id);
    }
  }

  $scope.promote = function (index) {

    var entries = $scope.evaluation.entries;

    EntryFactory.promote(entries[index]._id);

    if ( index === 0 ) {
      VoteFactory.add($scope.votes[entries[1]._id], entries[1]._id, $scope.email);

      if ( $scope.feedbacks[entries[0]._id] ) {
        FeedbackFactory.create(entries[1]._id, $scope.email, $scope.feedbacks[entries[1]._id]);
      }

      entries.splice(1, 1);
    }

    else {
      VoteFactory.add($scope.votes[entries[0]._id], entries[0]._id, $scope.email);

      if ( $scope.feedbacks[entries[0]._id] ) {
        FeedbackFactory.create(entries[0]._id, $scope.email, $scope.feedbacks[entries[0]._id]);
      }

      entries[0] = entries.splice(2, 1)[0];

      /*if ( typeof entries[0] === 'undefined' ) {
        entries
      }*/

      console.log('entries', entries);
    }
  };

  $scope.finish = function () {

    if ( $scope.feedbacks[entries[0]._id] ) {
      FeedbackFactory.create(entries[0]._id, $scope.email, $scope.feedbacks[entries[0]._id]);
      VoteFactory.add($scope.votes[entries[0]._id], entries[0]._id, $scope.email);
    }

    if ( $scope.feedbacks[entries[1]._id] ) {
      FeedbackFactory.create(entries[1]._id, $scope.email, $scope.feedbacks[entries[1]._id]);
      VoteFactory.add($scope.votes[entries[1]._id], entries[1]._id, $scope.email);
    }

    if ( $scope.evaluation.entry ) {
      location.href = '/list/' + $scope.evaluation.topic.slug;
    }
    else {
      location.href = '/list/' + $scope.evaluation.topic.slug + '/me';
    }
  };
};