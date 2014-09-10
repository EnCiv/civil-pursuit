module.exports = function (EntryFactory, TopicFactory, SignFactory, EvaluationFactory, $http) {
  return {

    restrict: 'C',

    link: function ($scope) {

      // Function to clear the form

      $scope.clear = function () {
        $scope.entry.title        = '';
        $scope.entry.subject      = '';
        $scope.entry.description  = '';
        $scope.dataUrls           = [];
        
      }

      // Behavior to fetch URL's title

      $("[ng-model='create_entry.title']").on('change', function () {

        $scope.create_entry.url = $(this).val();

        $http.post('/tools/get-title', { url: $(this).val() })
          .error(function (error) {
            console.log(error);
          })
          .success(function (data) {
            console.log(data);
            $scope.create_entry.title = JSON.parse(data);
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

        // Fetch topic id by slug

        console.info('Topic', $scope.topic);

        TopicFactory
          .findBySlug( $scope.topic )
          
          .error(function (error) {
            console.error('No such topic', $scope.topic);
            $scope.alert = 'Sorry, an unexpected error has occurred. Please try again shortly!'
          })
          
          .success(function (data) {

            console.info('Topic found', $scope.topic);

            var topic = data.found;

            // Fetch user id by email

            console.info('User', $scope.email);

            SignFactory
              .findByEmail( $scope.email )

              .error(function (error) {
                console.error('User not found', $scope.email);
              })

              .success(function (data) {

                console.info('User found', $scope.email);

                var user = data.found;

                var path = require('path');

                // Create new Entry

                var entry  = {
                  subject:      $scope.form_create.subject.$modelValue,
                  description:  $scope.form_create.description.$modelValue,
                  user:         user._id,
                  topic:        topic._id,
                  image:        Array.isArray($scope.uploadResult) && $scope.uploadResult.length ?
                                  path.basename($scope.uploadResult[0].path) : null,
                  title:        $scope.form_create.title.$modelValue,
                  url:          $scope.form_create.url.$modelValue
                };

                console.info('New entry', entry);

                EntryFactory.publish(entry)

                  .error(function (error) {
                    console.error('Could not create entry', entry);
                  })

                  .success(function (data) {

                    console.info('Entry created', entry);

                    return;

                    // Create new Evaluation

                    var evaluation = {
                      topic:  topic._id,
                      user:   user._id,
                      entry:  data.created._id
                    };

                    console.info('New evaluation');

                    EvaluationFactory.create(evaluation)

                      .error(function (error) {
                        console.error('Could not create evaluation', evaluation, error);
                      })
                      
                      .success(function (data) {

                        // Take user to new Evaluation

                        location.href = '/evaluate/' + data.created._id;
                      });
                  });
              });
          })
      };
    }
  };
};
