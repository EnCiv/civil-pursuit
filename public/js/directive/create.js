// ----- Angular directive $('.synapp-create') ---------------------------------------------------  //
/*
 *  @abstract Angular directive for all elements with class name "synapp-create"
 *  @return   Object directive
 *  @param    Object createFactory
 */
// ---------------------------------------------------------------------------------------------  //
module.exports = function (EntryFactory, TopicFactory, SignFactory) { // ----- uses factory/create.js ------------------------  //
  return {
    // ---- Restrict directive to class --------------------------------------------------------  //
    restrict: 'C',
    // ---- Link function ----------------------------------------------------------------------  //
    link: function ($scope) {
      // ---- The `create` object ----------------------------------------------------------------  //
      $scope.create = {
        // ---- The alert function -------------------------------------------------------------  //
        /*
         *  @abstract   Displays an alert on UI
         *  @return     Null
         *  @param      String ^ Error alert
         */
        // -------------------------------------------------------------------------------------  //
        alert: function (alert) {
          // ---- If alert is a string, displays it such as ------------------------------------  //
          if ( typeof alert === 'string' ) {
            $scope.create.error = alert;
            return;
          }
          // ---- If alert is an object with the property "error" ------------------------------  //
          if ( alert.error ) {
            // ---- If Error has a declared status code ----------------------------------------  //
            if ( alert.error.statusCode ) {
              // ---- Show specific alerts depending on HTTP status code -----------------------  //
              switch ( alert.error.statusCode ) {
                // ---- on 401 error it meaans wrong password ----------------------------------  //
                case 401:
                  $scope.create.error = 'Wrong password';
                  $scope.create.password = '';
                  return;
                // ---- on 404 error it meaans credentias not found ----------------------------  //
                case 404:
                  $scope.create.error = 'Credentials not found';
                  return;
              }
            }
            // ---- Show specific alerts depending on error names ------------------------------  //
            switch ( alert.error.name ) {
              case 'ValidationError':
              case 'AssertionError':
                $scope.create.error = 'Invalid credentials';
                break;

              default:
                $scope.create.error = 'Something went wrong. Try again in a moment.';
                break;
            }
          }
        },
        // ---- The create in function -----------------------------------------------------------  //
        /*
         *  @abstract   Displays an alert on UI
         *  @return     Null
         *  @param      String ^ Error alert
         */
        // -------------------------------------------------------------------------------------  //
        publish: function () {
          // ----- Displays an alert on empty email --------------------------------------------  //
          /*  if ( ! $scope.create.image ) {
              $scope.create.alert('Please upload an image');
              return;
            }
            // ----- Displays an alert on empty title -----------------------------------------  //
            if ( ! $scope.create.title ) {
              $scope.create.alert('Please enter a title');
              return;
            } */
          // ----- Displays an alert on empty subject -----------------------------------------  //
          if ( ! $scope.create.subject ) {
            $scope.create.alert('Please enter a subject');
            return;
          }
          // ----- Displays an alert on empty description -----------------------------------------  //
          if ( ! $scope.create.description ) {
            $scope.create.alert('Please enter a description');
            return;
          }

          TopicFactory
            .findBySlug( $scope.topic )
            
            .error(function (error) {})
            
            .success(function (data) {
              var topic = data.found;

              SignFactory
                .findByEmail( $scope.email )

                .error(function (error) {

                })

                .success(function (data) {
                  var user = data.found;

                  EntryFactory.publish({
                    subject:      $scope.create.subject,
                    description:  $scope.create.description,
                    user:         user._id,
                    topic:        topic._id,
                    image:        $scope.selectedFiles[0].name
                  })

                    .success(function (data) {
                      location.href = '/topics/' + topic.slug + '/evaluate';
                    });
                });
            })

        }
      };
    }
  };
};
