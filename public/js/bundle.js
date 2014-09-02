(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** ***********************************************************************************  MODULE  **/
var deps = [];

if ( typeof createPage === 'boolean' ) {
	deps.push('angularFileUpload');
}

var synapp = angular.module('synapp', deps);
/** ********************************************************************************  FACTORIES  **/
synapp.factory({
  'SignFactory': 	require('./factory/Sign'),
  'TopicFactory': 	require('./factory/Topic'),
  'EntryFactory': 	require('./factory/Entry')
});
/** ******************************************************************************  CONTROLLERS  **/
synapp.controller({
  'UploadCtrl': 	require('./controller/upload')
});
/** *******************************************************************************  DIRECTIVES  **/
synapp.directive({
  'synappSign': 	require('./directive/sign'),
  'synappTopics': 	require('./directive/topics'),
  'synappCreate':	require('./directive/create')
});
// ---------------------------------------------------------------------------------------------- \\
},{"./controller/upload":2,"./directive/create":3,"./directive/sign":4,"./directive/topics":5,"./factory/Entry":6,"./factory/Sign":7,"./factory/Topic":8}],2:[function(require,module,exports){
FileAPI = {
  debug: true,
  //forceLoad: true, html5: false //to debug flash in HTML5 browsers
  //wrapInsideDiv: true, //experimental for fixing css issues
  //only one of jsPath or jsUrl.
    //jsPath: '/js/FileAPI.min.js/folder/', 
    //jsUrl: 'yourcdn.com/js/FileAPI.min.js',

    //only one of staticPath or flashUrl.
    //staticPath: '/flash/FileAPI.flash.swf/folder/'
    //flashUrl: 'yourcdn.com/js/FileAPI.flash.swf'
};

var uploadUrl = '/tools/upload';
window.uploadUrl = window.uploadUrl || 'upload';

var MyCtrl = [ '$scope', '$http', '$timeout', '$upload', function($scope, $http, $timeout, $upload) {

  $scope.howToSend = 1;

	$scope.usingFlash = FileAPI && FileAPI.upload != null;
	
  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
	
  $scope.uploadRightAway = true;
	
  $scope.hasUploader = function(index) {
		return $scope.upload[index] != null;
	};
	
  $scope.abort = function(index) {
		$scope.upload[index].abort(); 
		$scope.upload[index] = null;
	};
	
  $scope.onFileSelect = function($files) {

		$scope.selectedFiles = [];
		
    $scope.progress = [];
		
    if ($scope.upload && $scope.upload.length > 0) {
			for (var i = 0; i < $scope.upload.length; i++) {
				if ($scope.upload[i] != null) {
					$scope.upload[i].abort();
				}
			}
		}
		
    $scope.upload = [];
		
    $scope.uploadResult = [];
		
    $scope.selectedFiles = $files;
		
    $scope.dataUrls = [];
		
    for ( var i = 0; i < $files.length; i++) {
			var $file = $files[i];
			
      if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL($files[i]);
				
        var loadFile = function(fileReader, index) {
					fileReader.onload = function(e) {
						$timeout(function() {
							$scope.dataUrls[index] = e.target.result;
						});
					}
				}(fileReader, i);
			}
			
      $scope.progress[i] = -1;
			
      if ($scope.uploadRightAway) {
				$scope.start(i);
			}
		}
	};
	
	$scope.start = function(index) {
    console.log($scope.selectedFiles, $scope.howToSend);
		$scope.progress[index] = 0;
		$scope.errorMsg = null;
		if ($scope.howToSend == 1) {
			$scope.upload[index] = $upload.upload({
				url: uploadUrl,
				method: $scope.httpMethod,
				headers: {'my-header': 'my-header-value'},
				data : {
					myModel : $scope.myModel
				},
				/* formDataAppender: function(fd, key, val) {
					if (angular.isArray(val)) {
                        angular.forEach(val, function(v) {
                          fd.append(key, v);
                        });
                      } else {
                        fd.append(key, val);
                      }
				}, */
				/* transformRequest: [function(val, h) {
					console.log(val, h('my-header')); return val + '-modified';
				}], */
				file: $scope.selectedFiles[index],
				fileFormDataName: 'myFile'
			});
			$scope.upload[index].then(function(response) {
				$timeout(function() {
					$scope.uploadResult.push(response.data);
				});
			}, function(response) {
				if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
			}, function(evt) {
				// Math.min is to fix IE which reports 200% sometimes
				$scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});
			$scope.upload[index].xhr(function(xhr){
//				xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
			});
		} else {
			var fileReader = new FileReader();
            fileReader.onload = function(e) {
		        $scope.upload[index] = $upload.http({
		        	url: uploadUrl,
					headers: {'Content-Type': $scope.selectedFiles[index].type},
					data: e.target.result
		        }).then(function(response) {
					$scope.uploadResult.push(response.data);
				}, function(response) {
					if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
				}, function(evt) {
					// Math.min is to fix IE which reports 200% sometimes
					$scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				});
            }
	        fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
		}
	};
	
	$scope.dragOverClass = function($event) {
		var items = $event.dataTransfer.items;
		var hasFile = false;
		if (items != null) {
			for (var i = 0 ; i < items.length; i++) {
				if (items[i].kind == 'file') {
					hasFile = true;
					break;
				}
			}
		} else {
			hasFile = true;
		}
		return hasFile ? "dragover" : "dragover-err";
	};
} ];

module.exports = MyCtrl;
},{}],3:[function(require,module,exports){
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

      $scope.clear = function () {
        $scope.create.title = '';
        $scope.create.subject = '';
        $scope.create.description = '';
        $scope.dataUrls = [];
        $scope.create.error = null;
      }

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

},{}],4:[function(require,module,exports){
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
                location.reload();
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
              location.reload();
            });
        }
      };
    }
  };
};
},{}],5:[function(require,module,exports){
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
      $scope.selectedTopic =  'none';

      $scope.selectMeAsTopic = function (id) {
        $scope.selectedTopic = id;
      };

      TopicFactory.find()
        .error(function (error) {
          console.error(error);
        })
        .success(function (data) {
          $scope.topics = data.found;
        });
    }
  };
};
},{}],6:[function(require,module,exports){
module.exports = function ($http) {
  return {
    find: function () {
      return $http.get('/json/Entry');
    },

    publish: function (entry) {
      return $http.post('/json/Entry', entry);
    }
  };
};
},{}],7:[function(require,module,exports){
module.exports = function ($http) {
  return {
    in: function (creds) {
      return $http.post('/sign/in', creds);
    },

    up: function (creds) {
      return $http.post('/sign/up', creds);
    },

    findByEmail: function (email) {
      return $http.get('/json/User/findOne?email=' + email);
    }
  };
};
},{}],8:[function(require,module,exports){
module.exports = function ($http) {
  return {
    find: function () {
      return $http.get('/json/Topic');
    },

    findBySlug: function (slug) {
      return $http.get('/json/Topic/findOne?slug=' + slug);
    }
  };
};
},{}]},{},[1])