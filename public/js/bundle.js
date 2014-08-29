(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** ***********************************************************************************  MODULE  **/
var synapp = angular.module('synapp', []);
/** ********************************************************************************  FACTORIES  **/
synapp.factory({
  'SignFactory': 	require('./factory/Sign'),
  'TopicFactory': 	require('./factory/Topic')
});
/** *******************************************************************************  DIRECTIVES  **/
synapp.directive({
  'synappSign': 	require('./directive/sign'),
  'synappTopics': 	require('./directive/topics')
});
// ---------------------------------------------------------------------------------------------- \\
},{"./directive/sign":2,"./directive/topics":3,"./factory/Sign":4,"./factory/Topic":5}],2:[function(require,module,exports){
// ----- Angular directive $('.synapp-sign') ---------------------------------------------------  //
/*
 *  @abstract Angular directive for all elements with class name "synapp-sign"
 *  @return   Object directive
 *  @param    Object SignFactory
 */
// ---------------------------------------------------------------------------------------------  //
module.exports = function (SignFactory) { // ----- uses factory/Sign.js ------------------------  //
  return {
    // ---- Restrict directive to class --------------------------------------------------------  //
    restrict: 'C',
    // ---- Link function ----------------------------------------------------------------------  //
    link: function ($scope) {
      // ---- The `sign` object ----------------------------------------------------------------  //
      $scope.sign = {
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
            $scope.sign.error = alert;
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
                  $scope.sign.error = 'Wrong password';
                  $scope.sign.password = '';
                  return;
                // ---- on 404 error it meaans credentias not found ----------------------------  //
                case 404:
                  $scope.sign.error = 'Credentials not found';
                  return;
              }
            }
            // ---- Show specific alerts depending on error names ------------------------------  //
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
        // ---- The sign in function -----------------------------------------------------------  //
        /*
         *  @abstract   Displays an alert on UI
         *  @return     Null
         *  @param      String ^ Error alert
         */
        // -------------------------------------------------------------------------------------  //
        in: function () {
          // ----- Displays an alert on empty email --------------------------------------------  //
          if ( ! $scope.sign.email ) {
            $scope.sign.alert('Please enter a valid email');
            return;
          }
          // ----- Displays an alert on empty password -----------------------------------------  //
          if ( ! $scope.sign.password ) {
            $scope.sign.alert('Please enter a password');
            return;
          }
          // ----- On empty password confirmation, assume U wants to sign-in -------------------  //
          if ( ! $scope.sign.password_confirm ) {
            SignFactory.in(
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

            return;
          }
          // ----- On password confirm not empty but not matching ------------------------------  //
          if ( $scope.sign.password !== $scope.sign.password_confirm ) {
            return $scope.sign.alert("Passwords don't match");
          }
          // ----- Still here? Assuming by deduction U wants to sign up ------------------------  //
          // ----- Calling the method up() of factory/Sign -------------------------------------  //
          return SignFactory.up(
            // ----- Credentials ---------------------------------------------------------------  //
            {
              email:    $scope.sign.email,
              password: $scope.sign.password
            })
            // ----- On factory error ----------------------------------------------------------  //
            .error(function (error) {
              $scope.sign.alert(error);
            })
            // ----- On factory sucess ---------------------------------------------------------  //
            .success(function (data) {
              // ----- Letting the UI knowns user is signed in ---------------------------------  //
              $scope.isSignedIn = true;
            });
        }
      };
    }
  };
};
},{}],3:[function(require,module,exports){
// ----- Angular directive $('.synapp-sign') ---------------------------------------------------  //
/*
 *  @abstract Angular directive for all elements with class name "synapp-sign"
 *  @return   Object directive
 *  @param    Object TopicFactory
 */
// ---------------------------------------------------------------------------------------------  //
module.exports = function (TopicFactory) { // ----- uses factory/Sign.js ------------------------  //
  return {
    // ---- Restrict directive to class --------------------------------------------------------  //
    restrict: 'C',
    // ---- Link function ----------------------------------------------------------------------  //
    link: function ($scope) {
      TopicFactory.find()
        .error(function (error) {
          console.error(error);
        })
        .success(function (data) {
          $scope.topics = data.Topic.found;
        });
    }
  };
};
},{}],4:[function(require,module,exports){
module.exports = function ($http) {
  return {
    in: function (creds) {
      return $http.post('/sign/in', creds);
    },

    up: function (creds) {
      return $http.post('/sign/up', creds);
    }
  };
};
},{}],5:[function(require,module,exports){
module.exports = function ($http) {
  return {
    find: function () {
      return $http.get('/json/Topic');
    },

    up: function (creds) {
      return $http.post('/sign/up', creds);
    }
  };
};
},{}]},{},[1])