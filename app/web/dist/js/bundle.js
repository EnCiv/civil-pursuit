(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/francois/Dev/syn/app/web/angular/synapp/controllers/upload.js":[function(require,module,exports){
/**
 * `UploadCtrl` Uploader
 * 
 * @module synapp
 * @method controller::upload
 * @return {AngularController}
 * @example
 *    <ANY ng-controller="UploadCtrl" />
 * @author francoisrvespa@gmail.com
*/

;(function () {
  var FileAPI = {
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

  var uploadUrl     =   '/tools/upload';
  window.uploadUrl  =   window.uploadUrl || 'upload';

  var UploadCtrl = ['$rootScope', '$scope', '$http', '$timeout', '$upload',
    function UploadCtrl ($rootScope, $scope, $http, $timeout, $upload) {

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

        $rootScope.uploadResult = $scope.uploadResult;
        
        $scope.selectedFiles = $files;
        
        $scope.dataUrls = [];

        $rootScope.dataUrls = $scope.dataUrls;
        
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
            xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
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
    }];

  module.exports = UploadCtrl;
})();
},{}],"/home/francois/Dev/syn/app/web/angular/synapp/directives/creator.js":[function(require,module,exports){
;(function () {

  module.exports = ['$rootScope', 'DataFactory', Creator];

  function Creator ($rootScope, DataFactory) {
    return {
      restrict: 'C',
      templateUrl: '/templates/editor',
      scope: {
        type: '@',
        parent: '@'
      },
      controller: function ($scope) {
        $scope.item = {
          type: $scope.type
        };

        if ( $scope.parent ) {
          $scope.item.parent = $scope.parent;
        }

        $scope.getImage = function () {
          if ( Array.isArray($scope.$root.uploadResult) && $scope.$root.uploadResult.length ) {
            return $scope.$root.uploadResult[0].path.split(/\//).pop();
          }
        };

        $scope.save = function () {

          var item = {
            type: $scope.item.type,
            subject: $scope.item.subject,
            description: $scope.item.description,
            image: $scope.getImage()
          }

          if ( $scope.parent ) {
            item.parent = $scope.parent;
          }

          if ( $scope.item.references[0] ) {
            item.references = [];

            for ( var i in $scope.item.references ) {
              item.references[+i] = $scope.item.references[i];
            }
          }

          console.log('item', item);

          DataFactory.Item.create(item)
            .success(function (item) {
              $rootScope.items = [item].concat($rootScope.items);
              $scope.$parent.show = 'items';
            })
        };
      }
    };
  }

})();
},{}],"/home/francois/Dev/syn/app/web/angular/synapp/directives/evaluator.js":[function(require,module,exports){
;(function () {

  module.exports = [Evaluator];

  function Evaluator () {
    return {
      restrict: 'C',
      controller: function ($scope) {
      }
    };
  }

})();

},{}],"/home/francois/Dev/syn/app/web/angular/synapp/directives/item-media.js":[function(require,module,exports){
module.exports = [
  function ItemMedia () {
    return {
      restrict: 'C',
      scope: {
        url:    '@',
        filter: '@',
        image:  '@'
      },
      link: function ($scope, $elem) {
        var regexYouTube = /^https?:\/\/+.*\.youtu(be.+)|(\.be)\?.*v=(.+)(&|$|\s)/

        if ( $scope.url && regexYouTube.test($scope.url) ) {
          var youtube;
          $scope.url.replace(regexYouTube, function (m, v) {
            youtube = v;
          });
          var container = $('<div></div>');
          container.addClass('video-container');
          var iframe = $('<iframe></iframe>');
          iframe.attr('src', 'http://www.youtube.com/embed/' + youtube);
          iframe.attr('frameborder', '0');
          iframe.attr('width', 560);
          iframe.attr('height', 315);
          container.append(iframe);
          $elem.append(container);
        }
        else if ( $scope.image ) {
          var image = $('<img />');
          image.addClass('img-responsive');
          image.attr('src', $scope.image);
          $elem.append(image);
        }
      }
    };
  }];

},{}],"/home/francois/Dev/syn/app/web/angular/synapp/directives/sign.js":[function(require,module,exports){
;(function () {

  module.exports = ['SignFactory', SignComponent];

  function SignComponent (SignFactory) {

    return {
      restrict: 'C',
      templateUrl: '/templates/sign',
      scope: {},
      controller: function ($scope) {
      },
      link: function ($scope, $elem, $attr) {
        $scope.sign = {};

        $scope.signByMail = {};

        $scope.agreeToTerms = false;

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

          // BACK END

          return SignFactory.signIn(
            {
              email: $scope.sign.email.toLowerCase(),
              password: $scope.sign.password
            })

            .error(function (error) {
              if ( error.error && error.error.statusCode && error.error.statusCode === 404 ) {
                return $scope.alert = 'Invalid credentials';
              }
              
              $scope.alert = 'An unexpected error has occurred. Please try again in a moment';
            })

            .success(function (data) {
              $scope.isSignedIn = true;
              location.reload();
            });

          // IF NO PASSWORD CONFIRMATION
          
          if ( ! $scope.sign.password_confirm ) {

            // SIGN IN

            SignFactory.signIn(
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

          return SignFactory.signUp(
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

        $scope.signUp = function (strategy) {

          // MUST AGREE

          if ( ! $scope.agreeToTerms ) {
            return $scope.alert = 'You must agree to our terms of service';
          }

          // FACEBOOK

          if ( strategy === 'facebook' ) {
            return location.href = '/auth/facebook';
          }

          // MUST HAVE EMAIL

          if ( ! $scope.signByMail.email ) {
            $scope.alert = 'Please enter a valid email';
            return;
          }

          // MUST HAVE PASSWORD
          
          if ( ! $scope.signByMail.password ) {
            $scope.alert = 'Please enter a password';
            return;
          }

          // MUST HAVE PASSWORD CONFIRM
          
          if ( ! $scope.signByMail.confirm ) {
            $scope.alert = 'Please confirm password';
            return;
          }

          // PASSWORD MUST MATCH
          
          if ( $scope.signByMail.confirm !== $scope.signByMail.password ) {
            $scope.alert = "Passwords don't match";
            return;
          }

          // BACK END

          return SignFactory.signUp(
            {
              email:      $scope.signByMail.email,
              password:   $scope.signByMail.password
            })

            .error(function (response, statusCode) {

              if ( response.error ) {
                if ( response.error.message ) {
                  // email already in use

                  if ( /duplicate/.test(response.error.message) ) {
                    return $scope.alert = 'This email address is already in use';
                  }
                }
              }

              $scope.alert = 'Something grrrr';
            })

            .success(function (data) {
              $scope.isSignedIn = true;
              location.reload();
            });
          };
      }
      }
    };

})();
},{}],"/home/francois/Dev/syn/app/web/angular/synapp/directives/url-fetcher.js":[function(require,module,exports){
/**
 * `getUrlTitle` Attempt to fetch a title from URL and inject back results to scope
 * 
 * @module synapp
 * @function directive::get-url-title
 * @return {AngularDirective}
 * @example
 *    <INPUT data-syn-get-url-title />
 * @author francoisrvespa@gmail.com
*/

module.exports = ['$http',
  function getUrlTitle ($http) {
    return {
      restrict: 'CA',

      link: function ($scope, $elem, $attr) {

        $scope.searchingTitle = false;

        $elem.on('change', function () {

          $scope.searchingTitle = true;

          $scope.searchingTitleFailed = false;

          $(this).data('changing', 'yes');

          $http.post('/tools/get-title', { url: $(this).val() })
            
            .error(function (error) {
              $scope.searchingTitleFailed = true;

              $scope.searchingTitle = false;
            })
            
            .success(function (data) {

              $elem.data('changing', 'no');

              $scope.searchingTitle = false;

              $scope.item.references[0].url = $elem.val();

              $scope.item.references[0].title = data;

              $elem.data('url', $scope.item.references[0].url);
              $elem.data('title', $scope.item.references[0].title);
            });
        });
      }
    };
  }];

},{}],"/home/francois/Dev/syn/app/web/angular/synapp/factories/Data.js":[function(require,module,exports){
/**
 * `DataFactory` Data -> monson factory
 * 
 * @module synapp
 * @method factory::data
 * @return {AngularFactory}
 * @author francoisrvespa@gmail.com
*/

module.exports = ['$http', DataFactory];

function DataFactory ($http) {

  var batchSize = synapp["navigator batch size"];

  function querystring_format (url, query) {
    var params = [];
    
    query = query || {};

    // Set limit

    query[batchSize] = undefined;

    for ( var field in query ) {
      if ( query[field] === undefined ) {
        params.push(field);
      }
      else {
        params.push([field, query[field]].join('='));
      }
    }

    url += '?' + params.join('&');

    return url;
  }

  return {
    Item: {
      find: function (item) {
        return $http.get(querystring_format('/models/Item', item));
      },

      update: function (id, item) {
        return $http.put('/models/Item?_id=' + id, item);
      },

      create: function (item) {
        return $http.post('/models/Item', item);
      },
      
      evaluate: function (id) {
        return $http
          .get('/models/Item.evaluate/' + id);
      }
    },

    Feedback: {
      find: function (feedback) {
        return $http.get(querystring_format('/models/Feedback', feedback));
      }
    }
  };
};

},{}],"/home/francois/Dev/syn/app/web/angular/synapp/factories/Sign.js":[function(require,module,exports){
/**
 * `UserFactory` User Factory (legacy from SignCtrl)
 * 
 * @module synapp
 * @submodule factories
 * @method factory::user
 * @return {AngularFactory}
 * @author francoisrvespa@gmail.com
*/

module.exports = function SignFactory ($http) {
  return {
    signIn: function (creds) {
      return $http.post('/sign/in', creds);
    },

    signUp: function (creds) {
      return $http.post('/sign/up', creds);
    }
  };
};

},{}],"/home/francois/Dev/syn/app/web/angular/synapp/filters/shorten.js":[function(require,module,exports){
/**
 * `shortenFilter` Chops off a string if it exceeds maximum
 * 
 * @module filters/shorten
 * @example
 *    <!-- HTML -->
 *    <ANY ng-bind='"hello" | shortenFilter:3' />
 *    
 *    // JS
 *    var shortened = shortenFilter("hello", 3);
 * @author francoisrvespa@gmail.com
*/

module.exports = function shortenFilter () {

  /** @method shorten
   * @param str {string} - the string to shorten
   * @param max {number} - the limit
   * @return {?string}
  */
  function shorten (str, max) {
    if ( str ) {
      return str.substr(0, max);
    }
  };

  return shorten;
};

},{}],"/home/francois/Dev/syn/app/web/angular/synapp/index.js":[function(require,module,exports){
/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  function compile (item, into, scope, $compile) {

    function _compile (type) {

      var tpl = '<div ' +
        ' data-type    =   "' + type + '" ' +
        ' data-parent  =   "' + item._id + '"' +
        ' class        =   "navigator"></div>';

      return $compile(tpl)(scope);
    }

    var has = synapp['item relation'][item.type];

    console.log(has);

    if ( has ) {
      var row = $('<div class="row"></div>'),
        target = into.find('.children');

      if ( Array.isArray( has ) ) {
        has.forEach(function (type) {

          if ( Array.isArray( type ) ) {
            var col1 = $('<div class="col-xs-6 split-view"></div>');
            col1.append(_compile(type[0]));
            
            var col2 = $('<div class="col-xs-6 split-view"></div>');
            col2.append(_compile(type[1]));
            
            row.append(col1, col2);
            target.append(row);
          }

          else {
            target.append(_compile(type));
          }
        });
      }

      else {
        target.append(_compile(has));
      }
    }

    return true;
  }

  angular.module('synapp', ['angularFileUpload'])
    
    .factory('DataFactory', require('./factories/Data'))

    .factory('SignFactory', require('./factories/Sign'))

    .filter('shorten', require('./filters/shorten'))
    
    .filter('calculatePromotionPercentage', function () {
      return function (item) {
        if ( item ) {
          if ( ! item.promotions ) {
            return 0;
          }
          return Math.floor(item.promotions * 100 / item.views);
        }
      }
    })
    
    .filter('getEvaluationItems', ['$rootScope', function ($rootScope) {
      return function (items, item_id) {
        if ( items && item_id ) {
          var evaluation = $rootScope.evaluations
            .reduce(function (evaluation, candidate) {
              if ( candidate.item === item_id ) {
                evaluation = candidate;
              }
              return evaluation;
            }, null);

          if ( evaluation ) {
            return evaluation.items;
          }

          return [];
        }
      };
    }])

    .filter('getFeedbackByItem', [function () {
      return function (feedbacks, item_id) {
        if ( feedbacks ) {
          return feedbacks.filter(function (feedback) {
            return feedback.item === item_id;
          });
        }
      };
    }])

    .filter('filterItems', function () {
      return function (items, type, parent) {
        if ( items ) {

          var query = {};

          if ( type ) {
            query.type = type;
          }

          if ( parent ) {
            query.parent = parent;
          }

          return items.filter(function (item) {
            for ( var field in query ) {
              if ( item[field] !== query [field] ) {
                return false;
              }
            }
            return true;
          });
        }
      };
    })

    .controller('UploadCtrl', require('./controllers/upload'))

    .directive('sign', require('./directives/sign'))

    .directive('item', ['$rootScope', function ($rootScope) {
      return {
        restrict: 'C',
        controller: function ($scope) {

          $scope.loaded = {};

          $scope.$watch('$show', function (show, _show) {
            if ( show && show !== _show ) {
              if ( ! $scope.loaded[show] ) {
                switch ( show ) {
                  case 'children':
                    $scope.loaded.children = true;
                    $scope.$parent.loadChildren($scope.item._id);
                    break;
                }
              }
            }
          });
        }
      };
    }])
    
    .directive('navigator', ['$rootScope', '$compile', 'DataFactory', function ($rootScope, $compile, DataFactory) {
      return {
        restrict: 'C',
        templateUrl: '/templates/navigator',
        scope: {
          type:' @',
          parent: '@'
        },
        controller: function ($scope) {
          
          $scope.loadChildren = function (item_id) {

            var item = $rootScope.items.reduce(function (item, _item) {
              if ( _item._id === item_id ) {
                item = _item;
              }
              return item;
            }, null);

            var scope = $scope.$new();

            compile(item, $('#item-' + item_id), scope, $compile);

            // DataFactory.Item.find({ parent: item_id })
            //   .success(function (items) {
            //     $rootScope.feedbacks = $rootScope.feedbacks.concat(feedbacks);
            //   });
          };
          
        },
        link: function ($scope, $elem, $attrs) {
        }
      };
    }])

    .directive('creator', require('./directives/creator'))

    .directive('evaluator', require('./directives/evaluator'))

    .directive('synappUrlFetcher', require('./directives/url-fetcher'))

    .directive('editor', ['DataFactory', function (DataFactory) {
      return {
        restrict: 'C',
        templateUrl: '/templates/editor',
        controller: function ($scope) {
          $scope.save = function () {
            DataFactory.Item.update($scope.item._id, {
              subject: $scope.item.subject,
              description: $scope.item.description,
              image: (function () {
                if ( Array.isArray($scope.$root.uploadResult) && $scope.$root.uploadResult.length ) {
                    return $scope.$root.uploadResult[0].path.split(/\//).pop();
                  }
              })()
            });
          };
        }
      };
    }])

    .directive('synappItemMedia', require('./directives/item-media'))

    .run(require('./run'));
  
})();


},{"./controllers/upload":"/home/francois/Dev/syn/app/web/angular/synapp/controllers/upload.js","./directives/creator":"/home/francois/Dev/syn/app/web/angular/synapp/directives/creator.js","./directives/evaluator":"/home/francois/Dev/syn/app/web/angular/synapp/directives/evaluator.js","./directives/item-media":"/home/francois/Dev/syn/app/web/angular/synapp/directives/item-media.js","./directives/sign":"/home/francois/Dev/syn/app/web/angular/synapp/directives/sign.js","./directives/url-fetcher":"/home/francois/Dev/syn/app/web/angular/synapp/directives/url-fetcher.js","./factories/Data":"/home/francois/Dev/syn/app/web/angular/synapp/factories/Data.js","./factories/Sign":"/home/francois/Dev/syn/app/web/angular/synapp/factories/Sign.js","./filters/shorten":"/home/francois/Dev/syn/app/web/angular/synapp/filters/shorten.js","./run":"/home/francois/Dev/syn/app/web/angular/synapp/run.js"}],"/home/francois/Dev/syn/app/web/angular/synapp/run.js":[function(require,module,exports){
;(function () {

  module.exports = ['$rootScope', 'DataFactory', Run];

  function Run ($rootScope, DataFactory) {

    $rootScope.items        =   [];
    $rootScope.evaluations  =   [];
    $rootScope.feedbacks    =   [];
    $rootScope.votes        =   [];
    $rootScope.show         =   {};

    $rootScope.getItems = function (item) {
      DataFactory.Item.find(item)
        .success(function (items) {
          $rootScope.items = $rootScope.items.concat(items);
        })
        .error(function () {
          console.log(arguments);
        });
    };

    $rootScope.getItems({ type: 'Topic' });

    $rootScope.addViewToItem = function (item) {
      DataFactory.Item.update(item._id, { $inc: { views: 1 } });
    };

    $rootScope.loadEvaluation = function (item_id) {
      var evaluation = $rootScope.evaluations
        .filter(function (evaluation) {
          return evaluation.item === item_id;
        });

      if ( ! evaluation.length ) {
        DataFactory.Item.evaluate(item_id)
          .success(function (evaluation) {
            evaluation.cursor = 1;
            evaluation.limit = 5;
            if ( evaluation.items.length < 6 ) {
              evaluation.limit = evaluation.items.length - 1;

              if ( ! evaluation.limit && evaluation.items.length === 1 ) {
                evaluation.limit = 1;
              }
            }
            evaluation.current = [];
            evaluation.next = [];

            var series = [
              function () { 
                evaluation.current[0] = evaluation.items.shift();
                $rootScope.addViewToItem(evaluation.current[0]);
              },
              function () {
                evaluation.current[1] = evaluation.items.shift();
                $rootScope.addViewToItem(evaluation.current[1]); 
              },
              function () { evaluation.next[0]    = evaluation.items.shift(); },
              function () { evaluation.next[1]    = evaluation.items.shift(); },
            ];

            var i = 0;

            while ( series[i] && evaluation.items.length ) {
              series[i]();
              i++;
            }


            $rootScope.evaluations.push(evaluation);
          });
      }

      else {

      }
    };

    $rootScope.loadDetails = function (item_id) {
      var feedback = $rootScope.feedbacks
        .filter(function (feedback) {
          return feedback.item === item_id;
        });

      if ( ! feedback.length ) {
        DataFactory.Feedback.find({ item: item_id })
          .success(function (feedbacks) {
            $rootScope.feedbacks = $rootScope.feedbacks.concat(feedbacks);
          });
      }

      else {

      }
    };
  }

})();

},{}]},{},["/home/francois/Dev/syn/app/web/angular/synapp/index.js"]);
