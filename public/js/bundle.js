(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** ***********************************************************************************  MODULE  **/
var synapp = angular.module('synapp', []);
/** ********************************************************************************  FACTORIES  **/
synapp.factory({
  'SignFactory': require('./factory/Sign')
});
/** *******************************************************************************  DIRECTIVES  **/
synapp.directive({
  'synappSign': require('./directive/sign')
});
// ---------------------------------------------------------------------------------------------- \\
},{"./directive/sign":2,"./factory/Sign":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}]},{},[1])