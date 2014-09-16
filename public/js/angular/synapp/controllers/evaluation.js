module.exports = function ($scope, EntryFactory) {
  $scope.comparing = [0, 1];

  $scope.votes = {};

  $scope.continue = function () {

    var entries = $scope.evaluation.entries;

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
      entries.splice(1, 1);
    }

    else {
      entries[0] = entries.splice(2, 1)[0];

      /*if ( typeof entries[0] === 'undefined' ) {
        entries
      }*/

      console.log('entries', entries);
    }
  };

  $scope.finish = function () {
    console.info('Evaluation done');
  };
};