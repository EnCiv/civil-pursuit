module.exports = function (EntryFactory) {
  return {
    restrict: 'C',

    link: function ($scope, $elem, $attr) {

      // find entries by topic slug (such as in lists)

      if ( $attr.topicSlug ) {
        EntryFactory.findByTopicSlug($attr.topicSlug)

          .success(function (entries) {
            $scope.entries = entries;
            $scope.entriesLoaded = true;
          });
      }

      // find single entry (such as in summary)

      if ( $attr.entry ) {
        EntryFactory.findById($attr.entry)

          .success(function (entry) {
            $scope.entry = entry;
          });
      }

    }
  };
};