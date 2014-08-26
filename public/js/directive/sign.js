module.exports = function (SignFactory) {
  return {
    restrict: 'C',
    link: function ($scope) {
      $scope.sign = {
        alert: function (alert) {
          if ( typeof alert === 'string' ) {
            return $scope.sign.error = alert;
          }
          if ( alert.error ) {
            if ( alert.error.statusCode ) {
              if ( alert.error.statusCode === 404 ) {
                return $scope.sign.error = 'Credentials not found';
              }
            }
            switch ( alert.error.name ) {
              case 'ValidationError':
              case 'AssertionError':
                $scope.sign.error = 'Invalid credentials';
                break;

              default:
                $scope.sign.error = 'Something went wrong. Try again in a moment.';
                break;
            }
          }
        },
        in: function () {

          if ( ! $scope.sign.email ) {
            return $scope.sign.alert('Please enter a valid email');
          }

          if ( ! $scope.sign.password ) {
            return $scope.sign.alert('Please enter a password');
          }

          if ( ! $scope.sign.password_confirm ) {
            return SignFactory.in(
              {
                email: $scope.sign.email,
                password: $scope.sign.password
              })

              .error(function (error) {
                if ( error.error && error.error.statusCode && error.error.statusCode === 404 ) {
                  return $scope.sign._up = true;
                }
                $scope.sign.alert(error);
              })

              .success(function (data) {
                $scope.isSignedIn = true;
              });
          }

          if ( $scope.sign.password !== $scope.sign.password_confirm ) {
            return $scope.sign.alert("Passwords don't match");
          }

          return SignFactory.up(
            {
              email: $scope.sign.email,
              password: $scope.sign.password
            })

            .error(function (error) {
              $scope.sign.alert(error);
            })

            .success(function (data) {
              $scope.isSignedIn = true;
            });
        }
      };
    }
  };
};