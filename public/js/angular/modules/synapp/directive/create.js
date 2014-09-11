// .synapp-create

module.exports = function (EntryFactory, TopicFactory, SignFactory, EvaluationFactory, $http) {
  return {

    restrict: 'C',

    link: function ($scope, $elem, $attrs) {

      // If entry attribute is defined, get entry

      if ( $attrs.entry ) {
        EntryFactory.findById($attrs.entry)
          .success(function (entry) {
            $scope.topic = entry.topic;
            $scope.entry = entry;
          })
      }

      // Function to clear the form

      $scope.clear = function () {
        $scope.entry.title        = '';
        $scope.entry.subject      = '';
        $scope.entry.description  = '';
        $scope.dataUrls           = [];
        
      }

      // Behavior to fetch URL's title

      $("[ng-model='entry.title']").on('change', function () {

        $scope.entry.url = $(this).val();

        $http.post('/tools/get-title', { url: $(this).val() })
          .error(function (error) {
            console.log(error);
          })
          .success(function (data) {
            console.log(data);
            $scope.entry.title = JSON.parse(data);
          });
      });

      // Function to publish entry

      $scope.create = function () {

        $scope.form_create.submitted = true;

        // Subject should not be empty

        if ( $scope.form_create.subject.$error.required ) {
          console.warn('Missing subject');
          return $scope.alert = 'Please enter a subject';
        }
        
        // Description should not be empty

        if ( $scope.form_create.description.$error.required ) {
          console.warn('Missing description');
          $scope.alert = 'Please enter a description';
          return;
        }

        // If entry has an _id, do a save

        if ( $scope.entry._id ) {

          // Update image if need be

          if ( Array.isArray($scope.uploadResult) && $scope.uploadResult.length ) {
            $scope.entry.image = $scope.uploadResult[0].path.split(/\//).pop();
          }

          // The update object

          var update = $scope.entry;

          // get rid of image if base64

          if ( update.image.length > 255 ) {
            delete update.image;
          }

          // Find entry by id and update it

          EntryFactory.findByIdAndUpdate($scope.entry._id, update)

            .success(function () {
              
              // Create new Evaluation

              var evaluation = {
                topic:  $scope.entry.topic,
                user:   $scope.entry.user,
                entry:  $scope.entry._id
              };

              // Create new evaluation

              EvaluationFactory.create(evaluation)

                .success(function (created) {

                  // Take user to new Evaluation

                  location.href = '/evaluate/' + created._id;
                });
            });
        }

        // Create entry

        else {
          
          // Fetch topic id by slug

          TopicFactory.findBySlug( $scope.topic )
            
            .success(function (topic) {

              // Fetch user id by email

              SignFactory
                
                .findByEmail( $scope.email )

                .success(function (user) {

                  // Create new Entry

                  var entry  = {
                    subject:      $scope.form_create.subject.$modelValue,
                    description:  $scope.form_create.description.$modelValue,
                    user:         user._id,
                    topic:        topic._id,
                    image:        Array.isArray($scope.uploadResult) && $scope.uploadResult.length ?
                                    $scope.uploadResult[0].path.split(/\//).pop() : null,
                    title:        $scope.form_create.title.$modelValue,
                    url:          $scope.form_create.url.$modelValue
                  };

                  // Call factory

                  EntryFactory.publish(entry)

                    .success(function (created) {

                      // Create new Evaluation

                      var evaluation = {
                        topic:  topic._id,
                        user:   user._id,
                        entry:  created._id
                      };

                      // Call factory

                      EvaluationFactory.create(evaluation)

                        .success(function (created) {

                          // Take user to new Evaluation

                          location.href = '/evaluate/' + created._id;
                        });
                    });
                });
            })
        }
      };
    }
  };
};
