(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/francois/Dev/elance/synappalpha/public/js/angular/monson/index.js":[function(require,module,exports){
;(function () {

  angular.module('monson', [])

    .factory('MonsonFactory', ['$http', function ($http) {
      function Model (model) {
        this.path     =   '/json/';
        this.model    =   model;
        this.query    =   {};
        this.sorters  =   [];

        this.url = this.path + model + '/';
      }

      Model.prototype.changePath = function(path) {
        this.path = path;

        return this;
      };

      Model.prototype.action = function(action) {
        this.url += action + '/';

        return this;
      };

      Model.prototype.findById = function(id) {
        this.action('findById');
        this.params([id]);

        return this;
      };

      Model.prototype.updateById = function(id) {
        this.action('updateById');
        this.params([id]);

        return this;
      };

      Model.prototype.findOne = function(id) {
        this.action('findOne');

        return this;
      };

      Model.prototype.params = function(params) {
        if ( Array.isArray(params) ) {
          this.url += params.join('/') + '/';
        }

        return this;
      };

      Model.prototype.populate = function() {

        var populators = [];

        for ( var i in arguments ) {
          populators.push(arguments[i]);
        }

        this.query['populate::' + populators.join('+')] = null;

        return this;
      };

      Model.prototype.sort = function(field, reverse) {
        var sorter = field;

        if ( reverse ) {
          sorter += '-';
        }

        this.sorters.push(sorter);

        return this;
      };

      Model.prototype.limit = function(limit) {
        this.query['limit::' + limit] = null;

        return this;
      };

      Model.prototype.applySorters = function() {
        if ( this.sorters.length ) {
          this.query['sort::' + this.sorters.join(',')] = null;
        }
      };

      Model.prototype.addQuery = function(object) {
        for ( var i in object ) {
          this.query[i] = object[i];
        }

        return this;
      };

      Model.prototype.applyQuery = function() {
        if ( Object.keys(this.query).length ) {
          var queries = [];

          for ( var i in this.query ) {
            if ( this.query[i] ) {
              queries.push(i + '=' + this.query[i]);
            }
            else {
              queries.push(i);
            }
          }

          this.url += '?' + queries.join('&');
        }
      };

      Model.prototype.get = function() {
        return this.request('get');
      };

      Model.prototype.post = function(payload) {
        return this.request('post', payload);
      };

      Model.prototype.put = function(payload) {
        return this.request('put', payload);
      };

      Model.prototype.request = function(method, payload) {
        this.applySorters();

        this.applyQuery();

        var q = $http[method](this.url, payload);

        q.ok = q.success;
        q.ko = q.error;

        return q;
      };

      return {
        request: function (model) {
          return new Model(model);
        }
      };
    }]);

})();

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/cloudinary/filters/cloudinary-transformation.js":[function(require,module,exports){
/**
 * `cloudinaryTransformationFilter` ** Return cloudinary transformation **
 *  https://cloudinary.com/console/transformations
 * 
 *  @module filters/cloudinary-transform
 *  @example
 *    <!-- HTML -->
 *    <img ng-src='image | cloudinaryTransformationFilter' />
 *    
 *    // JS
 *    var img = cloudinaryTransformationFilter(image);
 * @author francoisrvespa@gmail.com
*/

module.exports = function cloudinaryTransformationFilter () {

  /** @method cloudinaryTransformation
   * @param cloudinaryImageUrl {?string}
   * @return {?string}
  */
  function cloudinaryTransformation (cloudinaryImageUrl) {
    if ( cloudinaryImageUrl && typeof cloudinaryImageUrl === 'string' ) {
      return cloudinaryImageUrl.replace(/\/image\/upload\/v(.+)\/(.+)\.jpg$/,
        '/image/upload/' + synapp['cloudinary navigator images filter'] + '/$2.jpg');
    }
  }

  return cloudinaryTransformation;
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/cloudinary/index.js":[function(require,module,exports){
/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp.cloudinary', [])

    .filter({
      cloudinaryTransformationFilter: require('./filters/cloudinary-transformation')
    });
  
})();

},{"./filters/cloudinary-transformation":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/cloudinary/filters/cloudinary-transformation.js"}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/details/directives/details.js":[function(require,module,exports){
;(function () {

  /** Item Details Component
   *
   *  @function
   *  @return {Object} - Angular Directive Definition
   *  @example <div class="synapp-details" data-item="{{item._id}}"></div>
   */
  function DetailsDirective (DataFactory) {

    return {
      restrict: 'C',
      templateUrl: '/templates/details',
      scope: {
        itemId:   '@'
      },
      
      controller: function ($scope) {

        $scope.getItem = function (cb) {
          DataFactory.Item.get($scope.itemId)

            .success(cb);
          };

      },
      
      link: function ($scope, $elem, $attr) {
        $scope.state = 0;

        $elem
          .on('shown.bs.collapse', function (event) {
            if ( ! $scope.state ) {
              $scope.state = 1;
              $scope.getItem(function (details) {
                $scope.state = 2;
                $scope.details = details;
                $scope.item = details.item;
              });
            }
          });
      }
    }; 
  }

  module.exports = ['DataFactory', DetailsDirective];

})();

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/details/index.js":[function(require,module,exports){
/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp.details', ['synapp.services'])

	.directive('synappDetails', require('./directives/details'));
  
})();

},{"./directives/details":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/details/directives/details.js"}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/editor/controllers/upload.js":[function(require,module,exports){
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
},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/editor/directives/editor.js":[function(require,module,exports){
;(function () {

  /**
   *
   */

  module.exports = ['$rootScope', '$timeout', 'DataFactory', EditorComponent];

  function EditorComponent ($rootScope, $timeout, DataFactory) {
    return {
      restrict: 'C',
      
      scope: {
        type:         '@',
        parent:       '@',
        itemId:       '@',
        panelId:      '@'
      },
      
      templateUrl: '/templates/editor',
      
      controller: function ($scope) {

        // console.log('EDITOR', {
        //   type: $scope.type,
        //   parent: $scope.parent,
        //   itemId: $scope.itemId,
        //   panelId: $scope.panelId,
        //   id: $scope.$id
        // });

        /** @function */

        function getImage () {
          if ( Array.isArray($rootScope.uploadResult) && $rootScope.uploadResult.length ) {
            return $rootScope.uploadResult[0].path.split(/\//).pop();
          }
        }

        /** @prop {Object} - Item (being created OR being edited) */

        $scope.item = {
          references: []
        };

        /** @prop {bool} - True if (save()) in progress */
        /** @note Using Angular dot notation (Angular sppecific)
            -- and getting idiomatic while at it */

        $scope.is = {
          in: {
            progress: false
          }
        };

        /** */

        $scope.error = false;

        /** */

        $scope.$watch('error', function (error, _error) {
          if ( error ) {
            $scope.is.in.progress = false;
          }
        });

        /** Save the new item (either create or update)
         *  @function
         */

        $scope.save = function () {
          /** @des Trueing "is in progress" so User can not duplicate action */

          $scope.is.in.progress = true;

          /** @des Reset (error) to null so previous error messages get removed */

          $scope.error = null;

          /** @des Make sure we have a subject */

          if ( ! $scope.item.subject ) {
            $scope.error = 'Please enter a subject';
            
            $timeout(function () {
              //$(window).scrollTop();
            });

            return false;
          }

          /** @des Make sure we have a description */

          if ( ! $scope.item.description ) {
            return $scope.error = 'Please enter a description';
          }

          /** @des Show loading icon */

          $('#loading-editor').modal('show');

          /** @des Building the item to send to the back-end using this.item as model */

          var candidate = {
            subject: $scope.item.subject,
            description: $scope.item.description,
            references: $scope.item.references,
            type: $scope.type,
            parent: $scope.parent || null
          };

          if ( candidate.references && ! Array.isArray(candidate.references) ) {
            candidate.references = candidateect.keys(candidate.references).map(function (index) {
              return candidate.references[index];
            });
          }

          // UPDATE

          if ( $scope['item-id'] ) {
            candidate.image = getImage() || $scope.editor.image;
          }

          // CREATE

          else {
            candidate.image = getImage();

            console.log('candidate', candidate);

            setTimeout(function () {
              DataFactory.model('Item').post(candidate)

                .ok(
                  function (created) {
                    // attach upload image since cloudinary is async
                    if (  $rootScope.dataUrls &&  $rootScope.dataUrls.length ) {
                      created.image = $rootScope.dataUrls[0];
                    }

                    // Broadcasting we have a new item
                    console.log($scope.panelId + ' created item');
                    $rootScope.$emit($scope.panelId + ' created item', created);

                    // Turn off progress light
                    $scope.is.in.progress = false;

                    // Resetting item ng-model
                    $scope.item = {
                      references: []
                    };

                    // Resetting image
                    $rootScope.dataUrls = [];

                    // Hiding editor
                    $('#loading-editor').modal('hide');

                    // Collapsing
                    $scope.$elem.collapse('hide');
                  });
            }, synapp.latency[synapp.env]); 
          }
        };
      },

      link: function ($scope, $elem, $attr) {
        $scope.$elem = $elem;

        $scope.collapse = function () {
          $elem.collapse('hide');
        }
      }
    };
  }

})();

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/editor/directives/url-fetcher.js":[function(require,module,exports){
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

              $scope.item.references[0].title = JSON.parse(data);

              $elem.data('url', $scope.item.references[0].url);
              $elem.data('title', $scope.item.references[0].title);
            });
        });
      }
    };
  }];

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/editor/index.js":[function(require,module,exports){
/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp.editor', ['angularFileUpload', 'autoGrow', 'synapp.filters', 'synapp.services'])

    .directive('synappEditor',      require('./directives/editor'))
    .directive('synappUrlFetcher',  require('./directives/url-fetcher'))

    .controller('UploadCtrl',   require('./controllers/upload'));
  
})();

},{"./controllers/upload":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/editor/controllers/upload.js","./directives/editor":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/editor/directives/editor.js","./directives/url-fetcher":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/editor/directives/url-fetcher.js"}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/evaluator/directives/evaluator.js":[function(require,module,exports){
module.exports = ['DataFactory', function (DataFactory) {
	return {
		restrict: 'C',
		templateUrl: '/templates/evaluator',
    scope: {
      itemId: '@',
      limit: '@'
    },
    
    controller: function ($scope) {

      // console.log('EVALUATOR', {
      //   itemId: $scope.itemId,
      //   limit: $scope.limit,
      //   id: $scope.$id
      // });

      $scope.cursor = 1;

      /** @method onChange */

      function onChange () {

        // Add views counter

        if ( $scope.current[0] ) {
          console.info('Adding view to left item', $scope.current[0].subject)
          $scope.addView($scope.current[0]);
        }

        if ( $scope.current[1] ) {
          console.info('Adding view to right item', $scope.current[1].subject)
          $scope.addView($scope.current[1]);
        }
      }

      /** @method addView 
       *  @param item {ItemSchema}
       */

      $scope.addView = function (item) {
        DataFactory.Item.set(item._id, { $inc: { views: 1 } });
      };

      /** @method change */

      var change = function () {
        // if left has a feedback -- save it

        // if ( $scope.items[0].$feedback ) {
        //   DataFactory.Feedback.create($scope.items[0]._id, $scope.items[0].$feedback);
        // }

        // if right has a feedback -- save it

        // if ( $scope.items[1] && $scope.items[1].$feedback ) {
        //   DataFactory.Feedback.create($scope.items[1]._id, $scope.items[1].$feedback);
        // }

        // // votes

        // var votes = [];

        // // if left has votes

        // if ( $scope.items[0].$votes ) {
        
        //   for ( var criteria in $scope.items[0].$votes ) {
        //     votes.push({
        //       criteria: criteria,
        //       item: $scope.items[0]._id,
        //       value: $scope.items[0].$votes[criteria]
        //     })
        //   }
        // }

        // // if right has votes

        // if ( $scope.items[1] && $scope.items[1].$votes ) {
        
        //   for ( var criteria in $scope.items[1].$votes ) {
        //     votes.push({
        //       criteria: criteria,
        //       item: $scope.items[1]._id,
        //       value: $scope.items[1].$votes[criteria]
        //     })
        //   }
        // }

        // // save votes

        // if ( votes.length ) {
        //   DataFactory.model('Vote').post(votes);
        // }
      };

      /** @method promote 
       *  @param index {number} - 0 for left, 1 for right
       */

      $scope.promote = function (index) {

        change();

        // Promoting left item

        if ( index === 0 ) {

          // Increment promotions counter

          Item.set($scope.current[0]._id, { $inc: { promotions: 1 } });

          // finish if last

          if ( ! $scope.next.length ) {
            return $scope.finish();
          }

          // remove unpromoted from DOM

          $scope.current[1] = $scope.next.shift();

          onChange();
        }

        // Promoting right item

        else {

          // Increment promotions counter

          Item.set($scope.items[1]._id, { $inc: { promotions: 1 } });

          // finish if last

          if ( ! $scope.items[2] ) {
            return $scope.finish();
          }

          // remove unpromoted from DOM

          $scope.items[0] = $scope.items.splice(2, 1)[0];

          onChange();
        }

        // update cursor
        $scope.evaluator.cursor ++;
      };
    },
    
    link: function ($scope, $elem, $attr) {

      $scope.state = 0;

      $elem
        .on('show.bs.collapse', function () {

          if ( ! $scope.state ) {
            $scope.state = 1;

            DataFactory.Item.evaluate($scope.itemId)
              .success(function (evaluation) {

                $scope.state = 2;

                $scope.evaluation = evaluation;

                $scope.current = [];
                $scope.next = [];

                if ( evaluation.items.length) {
                  $scope.current.push(evaluation.items[0]);

                  if ( evaluation.items[1] ) {
                    $scope.current.push(evaluation.items[1]);
                  }

                  if ( evaluation.items[2] ) {
                    $scope.next.push(evaluation.items[2]);
                  }

                  if ( evaluation.items[3] ) {
                    $scope.next.push(evaluation.items[3]);
                  }
                }

                if ( evaluation.items.length < 6 ) {
                  $scope.limit = evaluation.items.length - 1;

                  if ( ! $scope.limit && evaluation.items.length === 1 ) {
                    $scope.limit = 1;
                  }
                }
                
              });
          }
        });
    }
	};
}];

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/evaluator/filters/get-currently-evaluated.js":[function(require,module,exports){
/**
 * `getCurrentlyEvaluatedFilter` Return the items being currently evaluated in an evaluation
 * 
 * @module filters/get-currently-evaluated
 * @example
 *    <!-- HTML -->
 *    <ANY ng-repeat='item in items | getCurrentlyEvaluatedFilter' />
 *    
 *    // JS +
 *    var currentlyEvaluated = getCurrentlyEvaluatedFilter(items);
 * @author francoisrvespa@gmail.com
*/

module.exports = function getCurrentlyEvaluatedFilter () {

  /** @method getCurrentlyEvaluated
   *  @param items {ItemSchema[]}
   *  @return {?ItemSchema[]}
   */

  function getCurrentlyEvaluated (items) {

    var current = [];
    
    if ( Array.isArray(items) && items.length ) {

      console.log('yeah items')
      
      current.push(items[0]);

      if ( items[1] ) {
        current.push(items[1]);
      }
    }

    console.log('current', current);

    return current;
  }

  return getCurrentlyEvaluated;
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/evaluator/index.js":[function(require,module,exports){
/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

	angular.module('synapp.evaluator', ['synapp.services', 'synapp.cloudinary'])

		.filter('getCurrentlyEvaluatedFilter', require('./filters/get-currently-evaluated'))

		.directive('synappEvaluator', require('./directives/evaluator'));
	
})();

},{"./directives/evaluator":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/evaluator/directives/evaluator.js","./filters/get-currently-evaluated":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/evaluator/filters/get-currently-evaluated.js"}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/filters/filters/shorten.js":[function(require,module,exports){
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

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/filters/index.js":[function(require,module,exports){
/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp.filters', [])

    .filter({
      shortenFilter:    [require('./filters/shorten')]
    });
  
})();
  
},{"./filters/shorten":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/filters/filters/shorten.js"}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/index.js":[function(require,module,exports){
/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  require('./services/index');
  require('./filters/index');
  require('./router/index');
  require('./cloudinary/index');
  require('./navigator/index');
  require('./editor/index');
  require('./evaluator/index');
  require('./details/index');
  require('./user/index');

  angular.module('synapp', [
    'synapp.user',
  	'synapp.router',
    'synapp.navigator',
    'synapp.editor',
    'synapp.evaluator',
    'synapp.details'
  ]);
  
})();

},{"./cloudinary/index":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/cloudinary/index.js","./details/index":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/details/index.js","./editor/index":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/editor/index.js","./evaluator/index":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/evaluator/index.js","./filters/index":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/filters/index.js","./navigator/index":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/navigator/index.js","./router/index":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/router/index.js","./services/index":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/services/index.js","./user/index":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/user/index.js"}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/navigator/directives/item-media.js":[function(require,module,exports){
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
        var regexYouTube = /^https?:\/\/+.*\.youtube.+\?.*v=(.+)(&|$|\s)/

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

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/navigator/directives/navigator.js":[function(require,module,exports){
;(function () {

  function NavigatorComponent ($rootScope, $timeout, $compile, DataFactory) {

    var on, emit, broadcast;

    return {
      restrict:       'C',
      scope:          {
        type: '@',
        from: '@',
        autoload: '@'
      },
      templateUrl:    '/templates/navigator',
      controller:     function ($scope) {

        $scope.state = 0;

        console.info('NAVIGATOR', {
          type: $scope.type,
          from: $scope.from,
          autoload: $scope.autoload,
          id: $scope.$id,
          parent: $scope.$parent.$id
        });

        on = function (event, callback) {
          $rootScope.$on($scope.$id + ' ' + event, callback)
        }

        emit = function (event, message) {
          console.info('EMIT', $scope.$id, event, message);
          $scope.$emit($scope.$id + ' ' + event, message);
        }

        broadcast = function (event, message) {
          console.info('BROADCAST', $scope.$id, event, message);
          $scope.$broadcast($scope.$id + ' '  + event, message);
        }

        $scope.getItems = function (cb) {
          // GET TOPICS

          DataFactory[$scope.type].get($scope.from)
            .success(function (items) {

              $scope.items = items;

              if ( items.length ) {
                emit('got items of type ' + items[0].type, items);
              }

              if ( cb ) {
                cb();
              }
            });
        }

        // UPDATE ITEMS

        on('created item', function (event, item) {
          $scope.items.push(item);
        });
      },
      
      link: function ($scope, $elem, $attr) {

        if ( $scope.autoload ) {
          $scope.getItems();
        }

        // Plus icon behavior to toggle editor's visibility

        function toggle_editor_view () {
          $elem.find('.fa-plus').on('click', function () {
            $(this).closest('.panel').find('.synapp-editor').collapse('toggle');
          });
        }

        toggle_editor_view();        

        // Compile nested panels directive

        function compileDirective (type, item) {
          var tpl = '<div data-type="' + type + '" data-from=":from:" class="synapp-navigator"></div>';
          return $compile(tpl.replace(/:from:/, item._id))($scope);
        }

        on('got items of type ' + $scope.type, function (event, items) {
          console.info('RECEIVED', $scope.$id, 'got items of type ' + $scope.type);
          $timeout(function () {

            var has = synapp['item relation'][$scope.type];

            if ( has ) {
              items.forEach(function (item, i) {

                var target = $elem.find('.nested-panels:eq(' + i + ')');
                var row = $('<div class="row"></div>');

                target.empty();

                if ( Array.isArray( has ) ) {
                  has.forEach(function (type) {

                    if ( Array.isArray( type ) ) {
                      
                      var col1 = $('<div class="col-xs-6"></div>');
                      col1.append(compileDirective(type[0], item));
                      
                      var col2 = $('<div class="col-xs-6"></div>');
                      col2.append(compileDirective(type[1], item));
                      
                      row.append(col1, col2);
                      target.append(row);
                    }
                    else {
                      target.append(compileDirective(type, item));
                    }
                  });
                }

                else {
                  target.append(compileDirective(has, item));
                }
              });
            }
          });
        });

        on('expand items', function (event, parent) {
          console.info('RECEIVED expand items', $scope.id, parent);
          if ( ! $scope.state ) {
            $scope.state = 1;
            $scope.getItems();
          }
        });

        // Function to toggle show/hide elements

        $scope.toggle = function (what, $event) {
          
          $($event.target).closest('.box-wrapper').find('.synapp-' + what + ':eq(0)').collapse('toggle');
        }

        function onExpand ($event) {
          console.info('EXPANDING',{ state: $scope.state, 
            autoload: $scope.autoload });

          $('.collapse.in')

            .each(function () {
              if ( ! $(this).has($event.target).length ) {
                $(this).collapse('hide');
              }
            });

          emit('expand items', $scope.$id);
        }

        function onExpanded ($event) {
          console.log('Hey! I have expend');
        }

        function onCollapse ($event) {
          console.log('Hey! I am collapsing');
        }

        function onCollapsed ($event) {
          console.log('Hey! I have collapsed');
        }

        $elem
          .on('show.bs.collapse',   onExpand)
          .on('shown.bs.collapse',  onExpanded)
          .on('hide.bs.collapse',   onCollapse)
          .on('hidden.bs.collapse', onCollapsed);

        $rootScope.$on('go to', function (event, route) {
          console.log('got go to', route);
        });
      }
    };
  }

  module.exports = ['$rootScope', '$timeout', '$compile', 'DataFactory', NavigatorComponent];

})();

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/navigator/directives/toggle-arrow.js":[function(require,module,exports){
;(function () {

  module.exports = ['$timeout', ToggleArrow];

  function ToggleArrow ($timeout) {
    return {
      restrict: 'CA',
      scope: true,
      link: function ($scope, $elem, $attrs) {
        $scope.toggle = false;

        var collapser = $elem.closest('.box-wrapper')
          .find('.nested-panels.collapse:first');

        $timeout(function () {
          $scope.is_nested = collapser.find('.synapp-navigator').length;
        });

        collapser

          .on('shown.bs.collapse', function ($event) {
            if ( $($event.target).is(collapser) ) {
              $scope.$apply(function () {
                $scope.toggle = true;
              });
            }
          })
          
          .on('hidden.bs.collapse', function ($event) {
            if ( $($event.target).is(collapser) ) {
              $scope.$apply(function () {
                $scope.toggle = false;
              });
            }
          });
      
        $elem.on('click', function () {
          collapser.collapse('toggle');
        });
      }
    };
  }

})();

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/navigator/filters/get-promoted-percentage.js":[function(require,module,exports){
/**
 * `getPromotedPercentageFilter` Get the promotion rate of an item as percentage
 * 
 * @module synapp
 * @class Filter
 * @method filter::get-promoted-percentage
 * @return {Number}
 * @param {Object} item - Items to parse
 * @example
 *    <!-- HTML -->
 *    <ANY ng-bind='item | getPromotedPercentageFilter' />
 *    
 *    // JS
 *    var percent = getPromotedPercentageFilter(item)
 * @author francoisrvespa@gmail.com
*/

module.exports = function () {
  return function getPromotedPercentage (item) {
    if ( item ) {
      if ( ! item.promotions ) {
        return 0;
      }

      return Math.ceil(item.promotions * 100 / item.views);
    }
  };
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/navigator/index.js":[function(require,module,exports){
/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp.navigator', ['synapp.services', 'synapp.cloudinary'])

    .filter({
      getPromotedPercentageFilter:  [require('./filters/get-promoted-percentage')],
    })

    .directive('synappNavigator', require('./directives/navigator'))

    .directive('synappItemMedia', require('./directives/item-media'))

    .directive('synappToggleArrow', require('./directives/toggle-arrow'));
  
})();

},{"./directives/item-media":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/navigator/directives/item-media.js","./directives/navigator":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/navigator/directives/navigator.js","./directives/toggle-arrow":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/navigator/directives/toggle-arrow.js","./filters/get-promoted-percentage":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/navigator/filters/get-promoted-percentage.js"}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/router/factories/Router.js":[function(require,module,exports){
/**
 * `DataFactory` Data -> monson factory
 * 
 * @module synapp
 * @method factory::data
 * @return {AngularFactory}
 * @author francoisrvespa@gmail.com
*/

module.exports = function RouterFactory () {
  return {};
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/router/index.js":[function(require,module,exports){
/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function (angular) {

  angular.module('synapp.router', [])

    .factory('RouterCtrl', require('./factories/Router'));
  
})(angular);

},{"./factories/Router":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/router/factories/Router.js"}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/services/factories/Data.js":[function(require,module,exports){
/**
 * `DataFactory` Data -> monson factory
 * 
 * @module synapp
 * @method factory::data
 * @return {AngularFactory}
 * @author francoisrvespa@gmail.com
*/

module.exports = function DataFactory (MonsonFactory) {

  var batchSize = synapp["navigator batch size"];

  return {
    model: function (model) {
      return MonsonFactory.request(model);
    },

    Item: {
      set: function (id, set) {
        return MonsonFactory.request('Item')

          .addQuery({ _id: id })

          .put(JSON.stringify(set));
      },

      evaluate: function (id) {
        return MonsonFactory.request('Item')

          .action('evaluate')

          .params([id])

          .get();
      },

      get: function (id) {
        return MonsonFactory.request('Item')

          .action('details')

          .params([id])

          .get();
      }
    },

    Topic: {
      get: function () {
        return MonsonFactory.request('Item')

          .addQuery({ type: 'Topic' })

          .sort('promotions', true)
          .sort('created', true)

          .limit(batchSize)

          .get();
      }
    },

    Problem: {
      get: function (topic) {
        return MonsonFactory.request('Item')

          .addQuery({
            type: 'Problem',
            parent: topic
          })

          .sort('promotions', true)

          .limit(batchSize)

          .get();
      }
    },

    Agree: {
      get: function (problem) {
        return MonsonFactory.request('Item')

          .addQuery({
            type: 'Agree',
            parent: problem
          })

          .sort('promotions', true)

          .limit(batchSize)

          .get();
      }
    },

    Disagree: {
      get: function (problem) {
        return MonsonFactory.request('Item')

          .addQuery({
            type: 'Disagree',
            parent: problem
          })

          .sort('promotions', true)

          .limit(batchSize)

          .get();
      }
    },

    Solution: {
      get: function (problem) {
        return MonsonFactory.request('Item')

          .addQuery({
            type: 'Solution',
            parent: problem
          })

          .sort('promotions', true)

          .limit(batchSize)

          .get();
      }
    },

    Pro: {
      get: function (problem) {
        return MonsonFactory.request('Item')

          .addQuery({
            type: 'Pro',
            parent: problem
          })

          .sort('promotions', true)

          .limit(batchSize)

          .get();
      }
    },

    Con: {
      get: function (problem) {
        return MonsonFactory.request('Item')

          .addQuery({
            type: 'Con',
            parent: problem
          })

          .sort('promotions', true)

          .limit(batchSize)

          .get();
      }
    },

    Feedback: {
      create: function (itemId, feedback) {
        return MonsonFactory.request('Feedback')

          .post({
            item: itemId,
            feedback: feedback
          });
      }
    }
  };
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/services/index.js":[function(require,module,exports){
/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  require('../../monson/index');

  angular.module('synapp.services', ['monson'])

    .factory({
      DataFactory: require('./factories/Data')
    });
  
})();

},{"../../monson/index":"/home/francois/Dev/elance/synappalpha/public/js/angular/monson/index.js","./factories/Data":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/services/factories/Data.js"}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/user/directives/sign.js":[function(require,module,exports){
;(function () {

  module.exports = ['UserFactory', SignComponent];

  function SignComponent (UserFactory) {

    return {
      restrict: 'C',
      templateUrl: '/templates/sign',
      scope: {},
      controller: function ($scope) {
        console.log('SIGN::controller', $scope);
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

          return UserFactory.signIn(
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

          return UserFactory.signUp(
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
},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/user/factories/User.js":[function(require,module,exports){
/**
 * `UserFactory` User Factory (legacy from SignCtrl)
 * 
 * @module synapp
 * @submodule factories
 * @method factory::user
 * @return {AngularFactory}
 * @author francoisrvespa@gmail.com
*/

module.exports = function UserFactory ($http) {
  return {
    signIn: function (creds) {
      return $http.post('/sign/in', creds);
    },

    signUp: function (creds) {
      return $http.post('/sign/up', creds);
    },

    findByEmail: function (email) {
      return $http.get('/json/User/findOne?email=' + email);
    }
  };
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/user/index.js":[function(require,module,exports){
/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp.user', [])

    .factory('UserFactory', require('./factories/User'))

    .directive('synappSign', require('./directives/sign'));
  
})();

},{"./directives/sign":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/user/directives/sign.js","./factories/User":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/user/factories/User.js"}]},{},["/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/index.js"]);
