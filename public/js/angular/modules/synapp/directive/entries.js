// .synapp-entries

module.exports = function (TopicFactory, SignFactory, EntryFactory, CriteriaFactory, VoteFactory) {
  return {
    restrict: 'C',

    link: function ($scope, $elem, $attr) {

      function findFactoryBySlug (cb) {
        TopicFactory.findBySlug($attr.topic)

          .success(function (topic) {
            $scope.topic = topic;
            cb();
          });
      }

      function findUserByEmail (cb) {
        SignFactory.findByEmail($attr.user)

          .success(function (user) {
            $scope.user = user;
            cb();
          });
      }

      function findCriterias (cb) {
        CriteriaFactory.find()

          .success(function (criterias) {
            $scope.criterias = criterias;
            cb();
          });
      }

      function findVotes (cb) {
        VoteFactory.findByEntries({
          entry:  $scope.entry._id,
          user:   $scope.user ? $scope.user._id : null
        })

          .success(function (votes) {
            $scope.votes = votes;
            cb();
          });
      }

      function findEntries (cb) {
        EntryFactory.find({
          topic:  $scope.topic._id,
          user:   $scope.user ? $scope.user._id : null
        })

          .success(function (entries) {
            $scope.entries = entries;
          });
      }

      // FLOW

      flow();

      function flow () {
        findFactoryBySlug(function () {

          if ( $attr.user ) {
            
            findUserByEmail(function () {
              
              findCriterias(function () {

                findEntries(function () {
                  
                  findVotes(function () {

                  });

                });
              });
            });
          }

          else {
            
            findCriterias(function () {

              findEntries(function () {
                
                findVotes(function () {

                });

              });
            });
          }

        });
      }
    }
  };
};