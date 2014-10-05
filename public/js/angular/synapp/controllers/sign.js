/**
 * `SignCtrl` Sign component
 * 
 * @module synapp
 * @method controller::sign
 * @return {AngularController}
 * @example
 *    <FORM ng-controller="SignCtrl" />
 * @author francoisrvespa@gmail.com
*/

module.exports = function ($scope, UserFactory) {

  $scope.sign = {};

  $scope.signIn = function () {   

    // MUST HAVE EMAIL


    if ( ! $scope.sign.email ) {
      $scope.alert = 'Please enter a valid email';
      return;
    }

    // MUST HAVE PASSWORD
    
    if ( ! $scope.sign.password ) {
      $scope.alert = 'Please enter a password';
      return;
    }

    // IF NO PASSWORD CONFIRMATION
    
    if ( ! $scope.sign.password_confirm ) {

      // SIGN IN

      UserFactory.signIn(
        {
          email: $scope.sign.email,
          password: $scope.sign.password
        })

        .error(function (error) {
          if ( error.error && error.error.statusCode && error.error.statusCode === 404 ) {
            return $scope.sign._up = true;
          }
          $scope.alert = error;
        })

        .success(function (data) {
          $scope.isSignedIn = true;
          location.reload();
        });

      return;
    }
    
    // PASSWORD CONFIRM MISMATCH

    if ( $scope.sign.password !== $scope.sign.password_confirm ) {
      return $scope.alert = "Passwords don't match";
    }

    // SIGN UP

    return UserFactory.signUp(
      // ----- Credentials ---------------------------------------------------------------  //
      {
        email:    $scope.sign.email,
        password: $scope.sign.password
      })
      // ----- On factory error ----------------------------------------------------------  //
      .error(function (error) {
        $scope.alert = error;
      })
      // ----- On factory sucess ---------------------------------------------------------  //
      .success(function (data) {
        // ----- Letting the UI knowns user is signed in ---------------------------------  //
        $scope.isSignedIn = true;
        location.reload();
      });
    };
};