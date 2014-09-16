// .synapp-topics

module.exports = function (TopicFactory, EntryFactory) {

  return {

    restrict: 'C',

    link: function ($scope, $elem, $attr) {

      // Get topic by slug

      if ( $attr.slug ) {
        TopicFactory.findBySlug($attr.slug)

          .success(function (topic) {
            
            $scope.topicLoaded    =   true;
            
            $scope.topic          =   topic;

          });
      }

      // Get topic which this entry id belongs to

      else if ( $attr.entry ) {
        EntryFactory.findById($attr.entry)

          .success(function (entry) {
            TopicFactory.findById(entry.topic)

              .success(function (topic) {
                $scope.topic = topic;
              });
          })
      }
      
      else {
        
        // Get topics

        TopicFactory.find()

          .success(function (topics) {
            
            $scope.topicsLoaded   =   true;
            
            $scope.topics         =   topics;

          });
      }
    }
  };
};