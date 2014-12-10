(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

  module.exports = ['$rootScope', '$scope', '$http', '$timeout', '$upload',
    UploadCtrl];

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
  }
})();
},{}],2:[function(require,module,exports){
;(function () {

  module.exports = ['$timeout', Charts];

  function Charts ($timeout) {
    return {
      restrict: 'CA',

      link: function ($scope, $elem, $attr) {

        var t1 = 0;

        var item = $scope.$parent.item._id;

        var criteria = $scope.criteria._id;

        var loaded = false;

        $scope.$root.$watch('votes', function (votes, _votes) {
          if ( votes && votes.length ) {

            if ( ! loaded ) {
              loaded = true;

              votes = votes.filter(function (vote) {
                return ( vote.item === item );
              });

              if ( votes.length && votes[0].criterias[criteria] ) {

                //svg.chart(id='chart-{{item._id}}-{{criteria._id}}')

                var svg = $('<svg class="chart"></svg>');

                svg.attr('id', 'chart-' + $scope.item._id + '-' + $scope.criteria._id);

                $elem.empty().append(svg);

                var data = [];

                for ( var number in votes[0].criterias[criteria].values ) {
                  data.push({
                    label: 'number',
                    value: votes[0].criterias[criteria].values[number] * 100 / votes[0].criterias[criteria].total
                  });
                }                

                var columns = ['votes'];

                data.forEach(function (d) {
                  columns.push(d.value);
                });

                console.log('columns', columns);

                var chart = c3.generate({
                    bindto: '#' + $elem.find('svg').attr('id'),

                    data: {
                      x: 'x',
                      columns: [['x', -1, 0, 1], columns],
                      type: 'bar'
                    },

                    grid: {
                      x: {
                        lines: 3
                      }
                    },
                    
                    axis: {
                      x: {},
                      
                      y: {
                        max: 90,

                        show: false,

                        tick: {
                          count: 5,

                          format: function (y) {
                            return y;
                          }
                        }
                      }
                    },

                    size: {
                      height: 80
                    },

                    bar: {
                      width: $(window).width() / 5
                    }
                });

                $timeout(function () {
                  $elem.find('.c3-chart-bar:first').hide();
                });
              }

              else {
                $elem.find('svg').css('height', '0');
              }
            }

          }
        });
      }
    };
  }

})();

},{}],3:[function(require,module,exports){
;(function () {

  module.exports = ['$rootScope', '$timeout', 'DataFactory', Creator];

  function Creator ($rootScope, $timeout, DataFactory) {
    return {
      restrict: 'C',
      scope: {
        type: '@',
        parent: '@'
      },
      controller: ['$scope', function ($scope) {
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

        $scope.save = function () { console.warn('hello');
          return;
          var item = {
            type: $scope.item.type,
            subject: $scope.item.subject,
            description: $scope.item.description,
            image: $scope.getImage()
          };

          if ( $scope.parent ) {
            item.parent = $scope.parent;
          }

          if ( $scope.item.references ) {
            item.references = [];

            for ( var i in $scope.item.references ) {
              item.references[+i] = $scope.item.references[i];
            }
          }

          DataFactory.Item.create(item)
            .success(function (item) {
              $rootScope.items = [item].concat($rootScope.items);
              $scope.$parent.show = 'items';

              $timeout(function () {
                
                var _scope = angular.element('#item-' + item._id).scope();

                _scope.$apply(function () {
                  _scope.$show = 'evaluator';
                });

                $rootScope.itemViewed  = item._id;

                $rootScope.lineage[item._id] = item.parent;
              });
            });
        };
      }],
      link: function ($scope, $elem, $attr) {
        
      }
    };
  }

})();

},{}],4:[function(require,module,exports){
;(function () {

  module.exports = [Details];

  function Details () {
    return {
      restrict: 'C',
      link: function ($scope, $elem) {
        $scope.emailBody = "I'm helping to bring synergy to democracy by voicing my opinion. I'm participating in the topic: " + '"' + $scope.item.subject + '". Please join me at Synaccord ' + location.href;
      }
    };
  }

})();

},{}],5:[function(require,module,exports){
;(function () {

  module.exports = ['DataFactory', '$timeout', Editor];

  function Editor (DataFactory, $timeout) {
    return {
      restrict: 'C',
      // templateUrl: '/templates/editor',
      controller: ['$scope', function ($scope) {

        $scope.saver = 'editor';
        
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
            image: $scope.getImage() || $scope.item.image
          }

          if ( $scope.item.parent ) {
            item.parent = $scope.item.parent;
          }

          if ( $scope.item.references ) {
            item.references = [];

            for ( var i in $scope.item.references ) {
              item.references[+i] = $scope.item.references[i];
            }
          }

          DataFactory.Item.create(item)
            .success(function (item) {
              $scope.$root.items = [item].concat($scope.$root.items);
              $scope.$parent.show = 'items';

              $timeout(function () {
                
                var _scope = angular.element('#item-' + item._id).scope();

                _scope.$apply(function () {
                  _scope.$show = 'evaluator';
                });

                $scope.$root.itemViewed  = item._id;

                $scope.$root.lineage[item._id] = item.parent;
              });
            });
        };

      }]
    };
  }
})();

},{}],6:[function(require,module,exports){
;(function () {

  module.exports = ['$timeout', Evaluator];

  function Evaluator ($timeout) {
    return {
      restrict: 'C',
      link: function ($scope, $elem) {
        $scope.closeEvaluation = function (inprogress) {
          if ( ! inprogress ) {
            $timeout(function () {
              if ( 2 === 1) {

              }
              else {
                $scope.$root.publish('toggle view', { item: $scope.item._id, view: 'details' });
              }
            }, 500);

            $timeout(function () {
              $scope.$root.evaluations = $scope.$root.evaluations
                .filter(function (evaluation) {
                  return evaluation.item !== $scope.item._id;
                });

              $elem.removeClass('is-loaded');
            }, 1000);
          }
        };

        $scope.editAndGoAgain = function (item) {
          $scope.$parent.show = "creator";
          $elem.closest('.panel').find('.creator').attr('subject', 'hello')
        };
      }
    };
  }

})();

},{}],7:[function(require,module,exports){
;(function () {

  module.exports = [ItemMedia];

  function ItemMedia () {
    return {
      restrict: 'C',
      scope: {
        url:    '@',
        filter: '@',
        image:  '@',
        subject:  '@',
        upload: '@'
      },
      link: function ($scope, $elem) {

        $scope.saver = 'item-media';
        
        var youtube = require('../lib/youtube')($scope.url);

        /** Url is a Youtube URL */

        if ( youtube ) {
          $elem.append(youtube);
        }

        /** There is an image */

        else if ( $scope.image && /cloudinary/.test($scope.image) ) {
          var image = $('<img />');
          image.addClass('img-responsive');
          image.attr('src', $scope.image);
          $elem.append(image);
        }

        /** There is an uploaded image */
        
        else if ( $scope.upload ) {
          var image = $('<img />');
          image.addClass('img-responsive');
          image.attr('src', $scope.upload);
          $elem.append(image);
        }
      }
    };
  }

})();

},{"../lib/youtube":27}],8:[function(require,module,exports){
;(function () {

  function isVisible (elem) {

    var parent = { elem: elem.parent() };

    parent.top = parent.elem.offset().top;

    parent.height = parent.elem.outerHeight();

    var child = { elem: elem };

    child.top = elem.offset().top;

    return (parent.top + parent.height) > child.top;
  }

  function compile (item, into, scope, $compile) {

    function _compile (type) {

      var tpl = '<div ' +
        ' data-type    =   "' + type + '" ' +
        ' data-parent  =   "' + item._id + '"' +
        ' class        =   "is-panel"></div>';

      return $compile(tpl)(scope);
    }

    var has = synapp['item relation'][item.type];

    if ( has ) {
      var row = $('<div class="row"></div>'),
        target = into.find('.children .is-section');

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

  module.exports = ['$rootScope', '$compile', '$timeout', 'DataFactory', 'Truncate', Item];

  function Item ($rootScope, $compile, $timeout, DataFactory, Truncate) {
    return {
      restrict: 'C',
      controller: ['$scope', function ($scope) {

        $scope.saver = 'item';

        /** @args {ObjectID} item_id */
        $scope.loadChildren = function (item_id) {

          var item = $rootScope.items.reduce(function (item, _item) {
            if ( _item._id === item_id ) {
              item = _item;
            }
            return item;
          }, null);

          var scope = $scope.$new();

          compile(item, $('#item-' + item_id), scope, $compile);

          DataFactory.Item.find({ parent: item_id })
            .success(function (items) {
              $rootScope.items = $rootScope.items.concat(items);
              /** Lineage */

              items.forEach(function (item) {
                $rootScope.lineage[item._id] = item.parent;
              });
            });
        };

        /** Listen to load children event **/
        $scope.$root.subscribe('load children', function (message) {
          if ( message.parent === $scope.item._id ) {
            $scope.loadChildren(message.parent);
            message.view.removeClass('is-loading').addClass('is-loaded');
          }
        });

      }],
      link: function ($scope, $elem, $attr) {
        $scope.isSplit = ['Agree', 'Disagree', 'Pro', 'Con']
          .indexOf($scope.item.type) > -1;

        $timeout(function () {
          new Truncate($elem);
        });
      }
    };
  }
})();

},{}],9:[function(require,module,exports){
;(function () {

  module.exports = ['$rootScope', '$timeout', 'DataFactory', 'View', PanelComponent];

  function PanelComponent ($rootScope, $timeout, DataFactory, View) {
    return {
      restrict: 'C',
      templateUrl: '/templates/panel',
      scope: {
        type:' @',
        parent: '@'
      },
      controller: ['$scope', function ($scope) {

        $scope.batchSize = synapp['navigator batch size'];



        /** load more items */

        $scope.loadMore = function () {

          View.scrollToPointOfAttention($scope.elem.find('.load-more'), function () {

          });

          var query = { type: $scope.type, $skip: $scope.batchSize };

          if ( $scope.parent ) {
            query.parent = $scope.parent;
          }

          DataFactory.Item.find(query)
            .success(function (items) {
              $rootScope.items = $rootScope.items.concat(items);
              /** Lineage */

              items.forEach(function (item) {
                $rootScope.lineage[item._id] = item.parent;
              });

              $scope.batchSize += synapp['navigator batch size'];

              $timeout(function () {
                /*new Truncate($scope.elem);*/
              });
            });
        };
        
      }],
      link: function ($scope, $elem, $attrs) {

        $scope.saver = 'panel';

        $scope.elem = $elem;

        var id = 'panel-' + $scope.type;

        if ( $scope.parent ) {
          id += $scope.parent;
        }

        $elem.attr('id',  id);

      }
    };
  }

})();

},{}],10:[function(require,module,exports){
;(function () {

  module.exports = ['SignFactory', SignComponent];

  function SignComponent (SignFactory) {

    return {
      restrict: 'C',
      templateUrl: '/templates/sign',
      scope: {},
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
},{}],11:[function(require,module,exports){
;(function () {

  module.exports = ['$timeout', SlidersComponent];

  function SlidersComponent ($timeout) {
    return {
      
      restrict: 'C',
      
      templateUrl: '/templates/sliders',

      link: function ($scope, $elem, $attr) {

        $timeout(function () {
          $elem.find('input.slider').slider();

          $elem.find('input.slider').slider('setValue', 0);

          $elem.find('input.slider').slider('on', 'slideStop',
            function () {
              var slider = $(this);

              if ( slider.attr('type') ) {

                var value = slider.slider('getValue');

                $scope.$parent.evaluation.votes[$scope.item._id][slider.data('criteria')] = value;
              }
            });
        });
      }
    }
  }

})();

},{}],12:[function(require,module,exports){
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

;(function () {
  module.exports = ['$http', getUrlTitle];

  function getUrlTitle ($http) {
    return {
      restrict: 'CA',

      link: function ($scope, $elem, $attr) {

        /** */

        $scope.searchingTitle = false;

        /** */

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

              $elem.closest('.description').find('[name="url"]').val($elem.val());

              $elem.data('url', $elem.val());
              $elem.data('title', data);
              $elem.val(data);

              var youtube = require('../lib/youtube')(data);

              if ( youtube ) {
                $elem.closest('.editor,.creator').find('.item-media')
                  .addClass('youtube')
                  .empty().append(youtube);
              }
            });
        });
      }
    };
  }
})();

},{"../lib/youtube":27}],13:[function(require,module,exports){
/**
 * `DataFactory` Data -> monson factory
 * 
 * @module synapp
 * @method factory::data
 * @return {AngularFactory}
 * @author francoisrvespa@gmail.com
*/

;(function () {
  module.exports = ['$http', DataFactory];

  function DataFactory ($http) {

    var batchSize = synapp["navigator batch size"];

    function querystring_format (url, query) {

      var params = [];
      
      query = query || {};

      // Set limit

      var limit = null, sort = null;

      for ( var q in query ) {
        if ( ! isNaN(q) ) {
          limit = +q;
        }
      }

      if ( limit === null ) {
        query[batchSize] = undefined;
      }

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
          item['sort:promotions-,created-'] = undefined;
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
        },

        details: function (id) {
          return $http
            .get('/models/Item.details/' + id);
        }
      },

      Feedback: {
        find: function (feedback) {
          return $http.get(querystring_format('/models/Feedback', feedback));
        },

        create: function (item, feedback) {
          return $http.post('/models/Feedback', {feedback: feedback, item: item});
        }
      },

      Criteria: {
        find: function (criteria) {
          criteria[100] = undefined;
          criteria['sort:criteria+'] = undefined;
          return $http.get(querystring_format('/models/Criteria', criteria));
        }
      },

      Vote: {
        find: function (vote) {
          return $http.get(querystring_format('/models/Vote', vote));
        },

        create: function (vote) {
          return $http.post('/models/Vote', vote);
        }
      }
    };
  };
})();

},{}],14:[function(require,module,exports){
;(function () {

  module.exports = ['$rootScope', 'View', EvaluationAsAService];

  function EvaluationAsAService ($rootScope, View) {
    function Evaluation (evaluation) {

      this.item       =   evaluation.item;
      this.items      =   evaluation.items;
      this.type       =   evaluation.type;
      this.criterias  =   evaluation.criterias;
      this.votes      =   [];

      this.cursor   =   1;
      this.limit    =   5;
      
      if ( this.items.length < 6 ) {
        this.limit = this.items.length - 1;

        if ( ! this.limit && this.items.length === 1 ) {
          this.limit = 1;
        }
      }
      
      this.current  =   [];
      this.next     =   [];

      var series = [
        function () { 
          this.current[0] = this.items.shift();
          $rootScope.addViewToItem(this.current[0]);
        }.bind(this),
        
        function () {
          this.current[1] = this.items.shift();
          $rootScope.addViewToItem(this.current[1]); 
        }.bind(this),
        
        function () { this.next[0] = this.items.shift(); }.bind(this),
        
        function () { this.next[1] = this.items.shift(); }.bind(this),
      ];

      var i = 0;

      while ( series[i] && evaluation.items.length ) {
        series[i]();
        i++;
      }
    }

    Evaluation.prototype.change = function(d) {
      View.scrollToPointOfAttention($('#item-' + this.item), function () {

      }, 1000);

      d = d || 'both';

      if ( this.current[0] ) {

        // feedback

        if ( this.current[0].$feedback ) {
          DataFactory.Feedback.create(this.current[0]._id,
            this.current[0].$feedback);

          $rootScope.items.forEach(function (item, index) {
            if ( item._id === this._id ) {
              this.$feedback.item = item._id;
              $rootScope.feedbacks.push(this.$feedback);
            }
          }.bind(this.current[0]));
        }

        // Votes

        if ( this.votes[this.current[0]._id] ) {

          var votes = [];

          for ( var criteria in this.votes[this.current[0]._id] ) {
            votes.push({
              item: this.current[0]._id,
              criteria: criteria,
              value: this.votes[this.current[0]._id][criteria]
            });
          }

          if ( votes.length ) {
            DataFactory.Vote.create(votes);
            var found = false;

            $rootScope.votes.forEach(function (vote, index) {
              console.warn(vote, this._id, index);
              if ( vote.item === this._id ) {
                found = index;
              }
            }.bind(this.current[0]));

            console.error('watch out', found, found !== false)

            if ( found !== false ) {
              console.warn($rootScope.votes, found)
              for ( var criteria in this.votes[this.current[0]._id] ) {
                $rootScope.votes[found].criterias[criteria].total ++;
                $rootScope.votes[found].criterias[criteria].values[this.votes[this.current[0]._id][criteria]] ++;
              }
            }
          }
        }
      }

      if ( this.current[1] ) {

        // Feedback

        if ( this.current[1].$feedback ) {
          DataFactory.Feedback.create(this.current[1]._id,
            this.current[1].$feedback);

          $rootScope.items.forEach(function (item, index) {
            if ( item._id === this._id ) {
              this.$feedback.item = item._id;
              $rootScope.feedbacks.push(this.$feedback);
            }
          }.bind(this.current[1]));
        }

        // Votes

        if ( this.votes[this.current[1]._id] ) {

          console.info('votes detected')

          var votes = [];

          for ( var criteria in this.votes[this.current[1]._id] ) {
            votes.push({
              item: this.current[1]._id,
              criteria: criteria,
              value: this.votes[this.current[1]._id][criteria]
            })
          }

          if ( votes.length ) {

            var found = false;

            $rootScope.votes.forEach(function (vote, index) {
              if ( vote.item === this._id ) {
                found = index;
              }
            }.bind(this.current[1]));

            DataFactory.Vote.create(votes)
              .success(function () {
                if ( found !== false ) {
                  for ( var criteria in this ) {
                    $rootScope.votes[found].criterias[criteria].total ++;
                    $rootScope.votes[found].criterias[criteria].values[this[criteria]] ++;
                  }
                }
              }.bind(this.votes[this.current[1]._id]));
          }

          
        }
      }

      if ( this.next.length ) {
        if ( d === 'left' || d === 'both' ) {
          this.current[0] = this.next.shift();
          $rootScope.addViewToItem(this.current[0]);
        }

        if ( d === 'right' || d === 'both' ) {
          if ( this.next.length ) {
            this.current[1] = this.next.shift();
            $rootScope.addViewToItem(this.current[1]);
          }
          else {
            this.current.splice(1, 1);
          }
        }

        if ( d === 'both' ) {
          if ( this.items.length ) {
            this.next.push(this.items.shift());
          }

          if ( this.cursor !== this.limit ) {
            this.cursor ++;
          }
        }

        if ( this.items.length ) {
          this.next.push(this.items.shift());
        }
        
        if ( this.cursor !== this.limit ) {
          this.cursor ++;
        }
      }

      else {
        this.current = [];
      }
    };

    Evaluation.prototype.continue = function() {
      this.change();
    };

    Evaluation.prototype.finish = function () {
      this.change();
    };

    Evaluation.prototype.promote = function(pos) {
      // Promoting left item

      if ( pos === 0 ) {

        $rootScope.addPromotionToItem(this.current[0]);

        this.change('right');
        
      }

      // Promoting right item

      else {

        $rootScope.addPromotionToItem(this.current[1]);

        this.change('left');

      }
    };

    return Evaluation;
  }

})();

},{}],15:[function(require,module,exports){
/**
 * `UserFactory` User Factory (legacy from SignCtrl)
 * 
 * @module synapp
 * @submodule factories
 * @method factory::user
 * @return {AngularFactory}
 * @author francoisrvespa@gmail.com
*/

;(function () {
  module.exports = ['$http', SignFactory];

  function SignFactory ($http) {
    return {
      signIn: function (creds) {
        return $http.post('/sign/in', creds);
      },

      signUp: function (creds) {
        return $http.post('/sign/up', creds);
      }
    };
  };
})();

},{}],16:[function(require,module,exports){
;(function () {

  module.exports = ['$rootScope', 'View', TruncateAsAService]

  function TruncateAsAService ($rootScope, View) {
    function Truncate (item) {

      // ============

      this.item = item;

      this.description = this.item.find('.description:first');

      this.textWrapper = this.item.find('.item-text:first');

      this.reference = this.item.find('.reference:first');

      this.text = this.description.text();

      this.words = this.text.split(' ');

      this.height = parseInt(this.textWrapper.css('paddingBottom'));

      this.truncated = false;

      this.moreLabel = 'more';

      this.lessLabel = 'less';

      this.isIntro = ( this.item.attr('id') === 'intro' );

      if ( ! this.isIntro ) {
        this._id = this.item.attr('id').split('-')[1];
      }

      // ============

      this.tagify();

      if ( this.truncated ) {
        item.addClass('is-truncated');
        this.appendMoreButton();
      }
    }

    Truncate.prototype.tagify = function () {

      var self = this;

      this.description.empty();

      this.reference.hide();

      var i = 0;

      this.words.forEach(function (word, index) {

        var span = $('<span class="word"></span>');

        if ( self.truncated ) {
          span.addClass('truncated');
          span.hide();
        }

        span.text(word + ' ');

        self.description.append(span);

        if ( i === 5 ) {

          var diff = self.textWrapper.height() > self.height;

          if ( diff && ! self.truncated && (index !== (self.words.length - 1)) ) {

            self.truncated = true;
          }

          i = -1;
        }

        i ++;
      });
    };

    Truncate.prototype.appendMoreButton = function () {

      var self = this;

      // create more button

      this.more = $('<span class="truncator"><i>... </i>[<a href=""></a>]</span>');

      // more button's text

      this.more.find('a').text(self.moreLabel);

      // more button's on click behavior

      this.more.find('a').on('click', function () {

        var moreLink = $(this);

        // Exit if already an animation in progress

        if ( self.item.find('.is-showing').length ) {
          return false;
        }

        View.scrollToPointOfAttention(self.item, function () {

          // Show more

          if ( moreLink.text() === self.moreLabel ) {
            
            // If is intro

            if ( self.isIntro ) {
              self.unTruncate();
              moreLink.closest('span').find('.reference').show();
              moreLink.text(self.lessLabel);
              moreLink.closest('span').find('i').hide();
            }
            
            else {
              // If there is already stuff shown, hide it first

              if ( self.item.find('.is-shown').length ) {
                
                // Trigger the toggle view to hide current shown items

                $rootScope.publish("toggle view",
                  { view: "text", item: self._id });

                // Listen on hiding done

                $rootScope.subscribe('did hide view', function (options) {

                  // Make sure it concerns our item

                  if ( options.item === self._id )  {

                    // untruncate

                    setTimeout(function () {
                      self.unTruncate();
                    });
                  }
                });
              }

              else {
                self.unTruncate();
                moreLink.closest('span').find('.reference').show();
                moreLink.text(self.lessLabel);
                moreLink.closest('span').find('i').hide();
              }
            }
          }

          // hide

          else {
            self.reTruncate();
            moreLink.closest('span').find('.reference').hide();
            moreLink.text(self.moreLabel);
            moreLink.closest('span').find('i').show();
          }
        });
      });

      this.description.append(this.more);
    };

    Truncate.prototype.unTruncate = function () {

      console.log('showing more');
        
      var self = this;

      var interval = 0;

      var inc = 50;

      // var inc = Math.ceil(self.height / self.words.length);

      // show words 50 by 50

      for ( var i = 0; i < this.words.length ; i += inc ) {
        setTimeout(function () {
          var k = this.i + inc;
          for ( var j = this.i; j < k ; j ++ ) {
            self.item.find('.truncated:eq(' + j + ')').show();
          }
        }.bind({ i: i }), interval += (inc * 1.5));
      }

      // on done showing words, wrap up

      
    };

    Truncate.prototype.reTruncate = function () {

      console.log('showing less');
      
      var self = this;

      var interval = 0;

      var inc = Math.ceil(self.height / self.words.length);

      for ( var i = 0; i < this.words.length ; i += inc ) {
        setTimeout(function () {
          var k = this.i + inc;
          for ( var j = this.i; j < k ; j ++ ) {
            self.item.find('.truncated:eq(' + j + ')').hide();
          }
        }.bind({ i: i }), interval += (inc * 2));
      }
    };

    return Truncate;
  }

})();
},{}],17:[function(require,module,exports){
;(function () {

  module.exports = [View];

  function View () {
    return {

      scrollToPointOfAttention: function (pointOfAttention, cb, speed) {

        var poa = (pointOfAttention.offset().top - 80);

        var current = $('body').scrollTop();

        if ( 
          (current === poa) || 
          (current > poa && (current - poa < 50)) ||
          (poa > current && (poa - current < 50)) ) {

          return cb();
        }

        $('body').animate({
          scrollTop: poa + 'px'
        }, speed || 500, 'swing', function () {
          cb();
        });
      }

    };
  }

})();

},{}],18:[function(require,module,exports){
;(function () {

  module.exports = [calculatePromotionPercentage];

  function calculatePromotionPercentage () {
    return function (item) {
      if ( item ) {
        if ( ! item.promotions ) {
          return 0;
        }
        return Math.floor(item.promotions * 100 / item.views);
      }
    }
  }
})();

},{}],19:[function(require,module,exports){
;(function () {

  module.exports = [CriteriaFilter];

  function CriteriaFilter () {
    return function (criterias, criteria) {
      if ( criterias ) {
        return criterias.filter(function (_criteria) {
          for ( var key in criteria ) {
            if ( _criteria[key] !== criteria[key] ) {
              return false;
            }
          }
          return true;
        });
      }
    };
  }

})();

},{}],20:[function(require,module,exports){
;(function () {

  module.exports = [FeedbackFilter];

  function FeedbackFilter () {
    return function (feedbacks, feedback) {
      if ( feedbacks ) {
        return feedbacks.filter(function (_feedback) {
          for ( var key in feedback ) {
            if ( _feedback[key] !== feedback[key] ) {
              return false;
            }
          }
          return true;
        });
      }
    };
  }

})();

},{}],21:[function(require,module,exports){
;(function () {

  module.exports = [Find];

  function Find () {
    return function (items, item) {
      if ( items ) {
        return items.filter(function (_item) {
          for ( var key in item ) {
            if ( _item[key] !== item[key] ) {
              return false;
            }
          }
          return true;
        });
      }
    };
  }

})();

},{}],22:[function(require,module,exports){
;(function () {

  module.exports = ['$rootScope', getEvaluationByItem];

  function getEvaluationByItem ($rootScope) {
    return function (evaluations, item_id) {
      if ( evaluations ) {
        return evaluations.filter(function (evaluation) {
          return evaluation.item === item_id;
        });
      }
    };
  }

})();
},{}],23:[function(require,module,exports){
;(function () {

  module.exports = ['$rootScope', getEvaluationItems];

  function getEvaluationItems ($rootScope) {
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
  }

})();
},{}],24:[function(require,module,exports){
;(function () {

  module.exports = [filterItems];

  function filterItems () {
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
  }
})();

},{}],25:[function(require,module,exports){
;(function () {

  module.exports = [shortenFilter];

  function shortenFilter () {

    /** @method shorten
     * @param str {string} - the string to shorten
     * @param max {number} - the limit
     * @return {?string}
    */
    function shorten (str, max) {
      if ( str ) {

        max = max || 100;

        if ( str.length < max ) {
          return str;
        }

        if ( /\s/.test(str[max]) ) {
          return str.substr(0, max);
        }

        var right = str.substr(max).split(/\s/);

        return str.substr(0, max) + right[0];
      }
    };

    return shorten;
  };

})();

},{}],26:[function(require,module,exports){
/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp', ['angularFileUpload', 'autoGrow'])

    .factory({
      DataFactory: require('./factories/Data'),
      SignFactory: require('./factories/Sign'),
      Truncate: require('./factories/Truncate'),
      View: require('./factories/View'),
      Evaluation: require('./factories/Evaluation')
    })

    .filter({
      shorten:                      require('./filters/shorten'),
      calculatePromotionPercentage: require('./filters/calculate-promotion-percentage'),
      getEvaluationItems:           require('./filters/get-evaluation-items'),
      getEvaluationByItem:          require('./filters/get-evaluation-by-item'),
      itemFilter:                   require('./filters/item-filter'),
      criteriaFilter:               require('./filters/criteria-filter'),
      feedbackFilter:               require('./filters/feedback-filter'),
      find:                         require('./filters/find')
    })

    .controller({
      'UploadCtrl': require('./controllers/upload')
    })

    .directive({
      /** Charts */
      charts:        require('./directives/charts'),

      /** Creator */
      creator:        require('./directives/creator'),

      /** Details */
      details:        require('./directives/details'),

      /** Editor */
      editor:         require('./directives/editor'),

      /** Evaluator */
      evaluator:      require('./directives/evaluator'),

      /** Item */
      item:           require('./directives/item'),

      /** Item Media */
      itemMedia:      require('./directives/item-media'),

      /** Panel */
      isPanel:        require('./directives/panel'),

      /** Sign */
      sign:           require('./directives/sign'),

      /** Sliders */
      sliders:        require('./directives/sliders'),

      /** Url Fetcher */
      urlFetcher:     require('./directives/url-fetcher'),
    })

    .run(require('./run'));
  
})();


},{"./controllers/upload":1,"./directives/charts":2,"./directives/creator":3,"./directives/details":4,"./directives/editor":5,"./directives/evaluator":6,"./directives/item":8,"./directives/item-media":7,"./directives/panel":9,"./directives/sign":10,"./directives/sliders":11,"./directives/url-fetcher":12,"./factories/Data":13,"./factories/Evaluation":14,"./factories/Sign":15,"./factories/Truncate":16,"./factories/View":17,"./filters/calculate-promotion-percentage":18,"./filters/criteria-filter":19,"./filters/feedback-filter":20,"./filters/find":21,"./filters/get-evaluation-by-item":22,"./filters/get-evaluation-items":23,"./filters/item-filter":24,"./filters/shorten":25,"./run":28}],27:[function(require,module,exports){
;(function () {

  function youtube (url) {
    var regexYouTube = /youtu\.?be.+v=([^&]+)/;

    if ( url && regexYouTube.test(url) ) {
      var youtube;
      url.replace(regexYouTube, function (m, v) {
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
      return container;
    }

    return false;
  }

  module.exports = youtube;

})();
},{}],28:[function(require,module,exports){
;(function () {

  module.exports = ['$rootScope', '$location', '$timeout',
    'DataFactory', 'Truncate', 'View', 'Evaluation',
    Run];

  function Run ($rootScope, $location, $timeout, DataFactory, Truncate, View, Evaluation) {

    /** @type [Model.Item] */
    $rootScope.items        =   [];

    /** @type [Evaluation] */
    $rootScope.evaluations  =   [];

    /** @type [Model.Feedback] */
    $rootScope.feedbacks    =   [];

    /** @type [Model.Vote] */
    $rootScope.votes        =   [];

    /** @deprecated */
    $rootScope.show         =   {};

    /** @??? */
    $rootScope.loadedItems  =   {};

    /** { $item_id: [Number] } Item's lineage */
    $rootScope.lineage      =   {};

    /** CRITERIAS */

    $rootScope.criterias = [];

    DataFactory.Criteria.find({})
      .success(function (criterias) {
        $rootScope.criterias = criterias;
      });

    /** ITEMS */

    $rootScope.getItems = function (item) {
      DataFactory.Item.find(item)
        .success(function (items) {
          $rootScope.items = $rootScope.items.concat(items);
          $rootScope.loadedItems[item.parent || item.type] = true;

          /** Lineage */

          items.forEach(function (item) {
            $rootScope.lineage[item._id] = item.parent;
          });

        })
        .error(function () {
          console.log(arguments);
        });
    };

    $rootScope.getItems({ type: 'Topic' });

    $rootScope.addViewToItem = function (item) {

      if ( ! item ) { return };

      DataFactory.Item.update(item._id, { $inc: { views: 1 } });
      $rootScope.items.forEach(function (_item, index) {
        if ( _item._id === item._id ) {
          $rootScope.items[index].views += 1;
        }
      });
    };

    $rootScope.addPromotionToItem = function (item) {
      DataFactory.Item.update(item._id, { $inc: { promotions: 1 } });
      $rootScope.items.forEach(function (_item, index) {
        if ( _item._id === item._id ) {
          $rootScope.items[index].promotions += 1;
        }
      });
    };

    $rootScope.itemHas = function (item, has) {
      
      if ( item && has ) {

        var child = $rootScope.lineage[has];

        while ( child ) {

          if ( child === item._id ) {
            return true;
          }
          child = $rootScope.lineage[child];
        }
      }
    };

    $rootScope.loadEvaluation = function (item_id) {
      var evaluation = $rootScope.evaluations
        .filter(function (evaluation) {
          return evaluation.item === item_id;
        });

      if ( ! evaluation.length ) {
        return DataFactory.Item.evaluate(item_id)
          .success(function (evaluation) {

            $rootScope.evaluations.push(new Evaluation(evaluation));

          });
      }

      else {

      }
    };

    $rootScope.loadDetails = function (item_id) {

      DataFactory.Item.details(item_id)
        .success(function (details) {

          var feedbacks = details.feedbacks;

          if ( $rootScope.feedbacks.length ) {
            feedbacks = feedbacks.filter(function (feedback) {
              return $rootScope.feedbacks.some(function (_feedback) {
                return _feedback._id === feedback._id;
              });
            });
          }

          $rootScope.feedbacks = $rootScope.feedbacks.concat(feedbacks);



          var vote = {
            item: item_id,
            criterias: details.votes
          };

          $rootScope.votes = $rootScope.votes
            .filter(function (vote) {
              return vote.item !== item_id;
            });

          $rootScope.votes.push(vote);

        });
    };

    // Load intro

    DataFactory.Item.find({ type: 'Intro' })
      .success(function (items) {
        $rootScope.intro = items[0];

        $timeout(function () {
          new Truncate($('#intro'));
          // console.log(Truncate);
        });

        // $(window).on('resize', ellipsis.bind($('#intro .item-text')));
      });

    // UI EVENT

    $rootScope.__channels = {};

    $rootScope.publish = function (channel, message) {
      if ( $rootScope.__channels[channel] ) {
        $rootScope.__channels[channel].forEach(function (subscriber) {
          subscriber(message);
        });
      }
    };

    $rootScope.subscribe = function (channel, subscriber) {
      if ( ! $rootScope.__channels[channel] ) {
        $rootScope.__channels[channel] = [];
      }

      $rootScope.__channels[channel].push(subscriber);
    };

    function show (elem, options, cb) {
      // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

      if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {
        return false;
      }

      // make sure margin-top is equal to height for smooth scrolling

      elem.css('margin-top', '-' + elem.height() + 'px');

      // animate is-section

      elem.find('.is-section:first').animate(
        
        {
          'margin-top': 0,
          // 'padding-top': 0,
        },

        500,

        function () {
          elem.removeClass('is-showing').addClass('is-shown');
          
          $rootScope.publish('did show view', options);
          
          if ( elem.css('margin-top') !== 0 ) {
            elem.animate({'margin-top': 0}, 250);
          }
          
          if ( cb ) cb();
        });

      elem.animate({
         opacity: 1
        }, 500);
    }

    function hide (elem, options, cb) {
      // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

      if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {
        return false;
      }

      elem.removeClass('is-shown').addClass('is-hiding');;

      elem.find('.is-section:first').animate({
          'margin-top': '-' + elem.height() + 'px',
          // 'padding-top': elem.height() + 'px'
        }, 1000, function () {
          elem.removeClass('is-hiding').addClass('is-hidden');
          $rootScope.publish('did hide view', options);
          if ( cb ) cb();
        });

      elem.animate({
         opacity: 0
        }, 1000);
    }

    // SUBSCRIBERS

    $rootScope.subscribe('toggle view', function (options) {

      var view = $('#item-' + options.item).find('.' + options.view);

      if ( ! view.hasClass('is-toggable') ) {
        view.addClass('is-toggable');
      }

      if ( view.hasClass('is-showing') || view.hasClass('is-hiding') ) {
        return false;
      }

      // if there is a shown truncated text

      if ( $('#item-' + options.item).hasClass('is-truncated') ) {
        if ( $('#item-' + options.item).find('.item-text:first .truncator a').text() === 'less' ) {
          $('#item-' + options.item).find('.item-text:first .truncator a').click();
          setTimeout(function () {
            View.scrollToPointOfAttention($('#item-' + options.item), function () {});
          })
        }
      }

      else {
        View.scrollToPointOfAttention($('#item-' + options.item), function () {});
      }

      // hide

      if ( view.hasClass('is-shown') ) {
        hide(view, options);
      }

      // show
      
      else {

        function _show () {
          if ( $('#item-' + options.item).find('.is-shown').length ) {
            hide($('#item-' + options.item).find('.is-shown'), options, function () {
              view.removeClass('is-hidden').addClass('is-showing');

              setTimeout(function () {
                show(view, options);
              });
            });
          }
          
          else {
            view.removeClass('is-hidden').addClass('is-showing');

            setTimeout(function () {
              show(view, options);
            });
          }
        }

        switch ( options.view ) {
          case 'evaluator':
            if ( ! view.hasClass('is-loaded') ) {
              return $rootScope.loadEvaluation(options.item)
                .success(function () {
                  view.addClass('is-loaded');
                  _show()
                });
            }
            break;
        }

        _show();

        switch ( options.view ) {
          case 'children':
            if ( ! view.hasClass('is-loaded') && ! view.hasClass('is-loading') ) {
              $rootScope.publish('load children', {
                parent: options.item,
                view: view
              });
            }
            break;
        }
      }
    });

    $rootScope.subscribe('toggle creator', function (options) {

      var id = '#panel-' + options.type;

      if ( options.parent ) {
        id += options.parent;
      }

      var panel = $(id);

      var creator = panel.find('.creator');

      if ( creator.hasClass('is-showing') || creator.hasClass('is-hiding') ) {
        return false;
      }

      function toggle () {
        // hide

        if (  creator.hasClass('is-shown') ) {
          hide( creator, options);
        }

        // show

        else {
          if ( panel.find('.is-shown').length ) { 
            hide(panel.find('.is-shown'), options, function () {

              creator.removeClass('is-hidden').addClass('is-showing');

              setTimeout(function () {
                show(creator, options);
              });
            });
          }
          
          else {
            creator.removeClass('is-hidden').addClass('is-showing');

            setTimeout(function () {
              show(creator, options);
            });
          }
        }
      }

      View.scrollToPointOfAttention(panel, function () {
      });

      toggle();
    });

    $rootScope.subscribe('create item', function (message) {

      /** Get box */

      var box = $(message.elem.target).closest('.box');

      /** Verify has subject */

      if ( ! box.find('input.item-title').val() ) {
        box.find('input.item-title')
          .addClass('danger')
          .off('keyup')
          .on('keyup', function () {
            if ( $(this).val() && $(this).hasClass('danger') ) {
              $(this).removeClass('danger');
            }
            else if ( ! $(this).val() && ! $(this).hasClass('danger') ) {
              $(this).addClass('danger');
            }
          })
          ;
      }

      /** Verify has description */

      else if ( ! box.find('.description textarea').val() ) {
        box.find('.description textarea')
          .addClass('danger')
          .off('keyup')
          .on('keyup', function () {
            if ( $(this).val() && $(this).hasClass('danger') ) {
              $(this).removeClass('danger');
            }
            else if ( ! $(this).val() && ! $(this).hasClass('danger') ) {
              $(this).addClass('danger');
            }
          })
          ;
      }

      /** Send to back end */

      else {
        var payload = {
          type: message.type,
          subject: box.find('input.item-title').val(),
          description: box.find('.description textarea').val(),
          image: (function () {

            if ( Array.isArray($rootScope.uploadResult) && $rootScope.uploadResult.length ) {
              return $rootScope.uploadResult[0].path.split(/\//).pop();
            }

          })()
        };

        if ( message.parent ) {
          payload.parent = message.parent;
        }

        if ( box.find('input[name="title"]').val() ) {
          payload.references = [{
            title: box.find('input[name="title"]').val(),
            url: box.find('input[name="url"]').val(),
          }];
        }

        DataFactory.Item.create(payload)
          .success(function (item) {
            $rootScope.items = [item].concat($rootScope.items);

            $rootScope.itemViewed  = item._id;

            $rootScope.lineage[item._id] = item.parent;
          });
      }
    });

    $rootScope.subscribe('edit item', function (message) {

      /** Get box */

      var box = $(message.elem.target).closest('.box');

      /** Verify has subject */

      if ( ! box.find('input.item-title').val() ) {
        box.find('input.item-title')
          .addClass('danger')
          .off('keyup')
          .on('keyup', function () {
            if ( $(this).val() && $(this).hasClass('danger') ) {
              $(this).removeClass('danger');
            }
            else if ( ! $(this).val() && ! $(this).hasClass('danger') ) {
              $(this).addClass('danger');
            }
          })
          ;
      }

      /** Verify has description */

      else if ( ! box.find('.description textarea').val() ) {
        box.find('.description textarea')
          .addClass('danger')
          .off('keyup')
          .on('keyup', function () {
            if ( $(this).val() && $(this).hasClass('danger') ) {
              $(this).removeClass('danger');
            }
            else if ( ! $(this).val() && ! $(this).hasClass('danger') ) {
              $(this).addClass('danger');
            }
          })
          ;
      }

      /** Send to back end */

      else {
        var payload = {
          type: message.type,
          from: message.item,
          subject: box.find('input.item-title').val(),
          description: box.find('.description textarea').val(),
          image: (function () {

            if ( Array.isArray($rootScope.uploadResult) && $rootScope.uploadResult.length ) {
              return $rootScope.uploadResult[0].path.split(/\//).pop();
            }

            var edited = $rootScope.items.reduce(
              function (edited, item) {

                if ( item._id === message.item ) {
                  edited = item;
                }

                return edited;
              },
              null);

            if ( edited && edited.image ) {
              return edited.image;
            }

          })()
        };

        DataFactory.Item.create(payload)
          .success(function (item) {
            $rootScope.items = [item].concat($rootScope.items);

            $rootScope.itemViewed  = item._id;

            $rootScope.lineage[item._id] = item.parent;
          });
      }
    });

    // SOCKET IO

    $rootScope.socket = io.connect('http://' + window.location.hostname + ':' +
    window.location.port);

    $rootScope.socket.on('online users', function (online_users) {
      $rootScope.online_users = online_users;
    });
  }

})();

},{}]},{},[26]);
