module.exports = function (EntryFactory, UserFactory) {
  return {
    restrict: 'C',

    link: function ($scope, $elem, $attr) {

      // Find many

      if ( $attr.topicSlug || $attr.userEmail ) {

        EntryFactory.get({
          'topic-slug': $attr.topicSlug,
          'user-email': $attr.userEmail
        })

          .success(function (entries) {
            $scope.entries = entries;
            $scope.entriesLoaded = true;
          });
      }

      // find single entry (such as in summary)

      if ( $attr.entry ) {
        EntryFactory.findById($attr.entry)

          .success(function (entry) {
            $scope.entryLoaded = true;
            $scope.entry = entry;
          });
      }

    }
  };
};