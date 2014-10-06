(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/controllers/details.js":[function(require,module,exports){
/**
 * `DetailsCtrl` Details
 * 
 * @module controllers/details
 * @prop item_id {string} - The item's id (retrieved from URL)
 * @prop item {ItemSchema} - The item
 * @prop votes {Accumulation} - Item's votes
 * @prop feedbacks {FeedbackSchema[]} - Item's feedbacks
 * @prop criterias {CriteriaSchema[]} - Item type's criterias
 * @example
 *    <ANY ng-controller="DetailsCtrl" ng-init="item_id = $routeParams.item_id" />
 * @author francoisrvespa@gmail.com
*/

module.exports = function DetailsCtrl ($scope, DataFactory, $timeout) {

  $timeout(function () {
    DataFactory.Item.get($scope.item_id)
      .success(function (details) {
        $scope.item       = details.item;

        $scope.votes      = details.votes;

        $scope.feedbacks  = details.feedbacks;

        $scope.criterias  = details.criterias;
      });
  }, 500);
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/controllers/editor.js":[function(require,module,exports){
/**
 * `EditorCtrl` Editor
 * 
 * @module controllers/editor
 * @prop editor {Object} - The edited item
 * @prop editor.error {(String | Null)} - Error message if any
 * @prop editor.subject {String} - Edited item's description
 * @example
 *    <ANY ng-controller="EditorCtrl" />
 * @author francoisrvespa@gmail.com
*/

module.exports = function ($scope, DataFactory, $timeout) {
  function getImage () {
    if ( Array.isArray($scope.uploadResult) && $scope.uploadResult.length ) {
      return $scope.uploadResult[0].path.split(/\//).pop();
    }
  }

  if ( ! $scope.editor ) {
    $scope.editor = {};
  }

  $scope.editor.$save = function () {
      
    this.$error = null;

    if ( ! $scope.editor.subject ) {
      return this.$error = 'Please enter a subject';
    }

    if ( ! $scope.editor.description ) {
      return this.$error = 'Please enter a description';
    }

    var obj = {};

    for ( var key in $scope.editor ) {
      if ( ! /^\$/.test(key) && key !== '_id' ) {
        obj[key] = $scope.editor[key];
      }
    }

    if ( obj.references && ! Array.isArray(obj.references) ) {
      obj.references = Object.keys(obj.references).map(function (index) {
        return obj.references[index];
      });
    }

    // update

    if ( $scope.editor._id ) {

      obj.image = getImage() || $scope.editor.image;

      console.log(obj.image)

      ItemFactory.updateById($scope.editor._id, obj)
      .success(function () {
        location.href = '/evaluate/create/';
      });
    }

    // create

    else {
      obj.image = getImage();

      DataFactory.model('Item').post(obj)

        .ok(
          function (created) {
            location.href = '/evaluate/' + created._id;
          });
    }
  };
  
  $timeout(function () {
    if ( $scope.editor.$item ) {
      ItemFactory.findById($scope.editor.$item)
        .success(function (item) {
          for ( var key in item ) {
            $scope.editor[key] = item[key];
          }
        });
    }
  });
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/controllers/evaluator.js":[function(require,module,exports){
/**
 * `EvaluatorCtrl` Evaluator
 * 
 * @module controllers/evaluator
 * @prop evaluator {Object} - Evaluator settings
 * @prop evaluator.cursor {number} - Item-to-item cursor
 * @prop evaluator.limit {number} - max item-to-item screens
 * @example
 *    <ANY ng-controller="EvaluatorCtrl" />
 * @author francoisrvespa@gmail.com
*/

module.exports = function EvaluatorCtrl ($scope, DataFactory, $timeout) {
      
  var Item = DataFactory.Item;

  $scope.evaluator  = {
    cursor: 1,
    limit: 5
  };

  /** @method onChange */

  function onChange () {

    // Add views counter

    if ( $scope.items[0] ) {
      console.info('Adding view to left item', $scope.items[0].subject)
      $scope.addView($scope.items[0]);
    }

    if ( $scope.items[1] ) {
      console.info('Adding view to right item', $scope.items[1].subject)
      $scope.addView($scope.items[1]);
    }
  }

  // fetch evaluation
  $timeout(function () {
    return Item.evaluate($scope.item)
      
      .ok(function (evaluation) {
        console.log(evaluation)
        
        $scope.items = evaluation.items;

        if ( $scope.items.length < 6 ) {
          $scope.evaluator.limit = $scope.items.length - 1;
        }

        $scope.criterias = evaluation.criterias;
        
        onChange();
      });
  });

  /** @method addView 
   *  @param item {ItemSchema}
   */

  $scope.addView = function (item) {
    Item.set(item._id, { $inc: { views: 1 } });
  };

  /** @method change */

  var change = function () {
    // if left has a feedback -- save it

    if ( $scope.items[0].$feedback ) {
      DataFactory.Feedback.create($scope.items[0]._id, $scope.items[0].$feedback);
    }

    // if right has a feedback -- save it

    if ( $scope.items[1].$feedback ) {
      DataFactory.Feedback.create($scope.items[1]._id, $scope.items[1].$feedback);
    }

    // votes

    var votes = [];

    // if left has votes

    if ( $scope.items[0].$votes ) {
    
      for ( var criteria in $scope.items[0].$votes ) {
        votes.push({
          criteria: criteria,
          item: $scope.items[0]._id,
          value: $scope.items[0].$votes[criteria]
        })
      }
    }

    // if right has votes

    if ( $scope.items[1].$votes ) {
    
      for ( var criteria in $scope.items[1].$votes ) {
        votes.push({
          criteria: criteria,
          item: $scope.items[1]._id,
          value: $scope.items[1].$votes[criteria]
        })
      }
    }

    // save votes

    if ( votes.length ) {
      DataFactory.model('Vote').post(votes);
    }
  };

  /** @method promote 
   *  @param index {number} - 0 for left, 1 for right
   */

  $scope.promote = function (index) {

    change();

    // Promoting left item

    if ( index === 0 ) {

      // Increment promotions counter

      Item.set($scope.items[0]._id, { $inc: { promotions: 1 } });

      // finish if last

      if ( ! $scope.items[2] ) {
        return $scope.finish();
      }

      // remove unpromoted from DOM

      $scope.items.splice(1, 1).length

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

  // continue

  $scope.continue = function () {

    change();

    // remove current entries from DOM
    $scope.items.splice(0, $scope.items[1] ? 2 : 1);

    // update cursor
    $scope.evaluator.cursor += 2;

    // when there are 3 items
    if ( $scope.evaluator.cursor > $scope.evaluator.limit && ($scope.evaluator.limit === 2 || $scope.evaluator.limit === 4) ) {
      $scope.evaluator.cursor = $scope.evaluator.limit;
    }

    onChange();

    // scroll back to top
    $(document).scrollTop(0);
  };

  // finish
  $scope.finish = function () {
    if ( $scope.item ) {
      location.href = '/details/' + $scope.item;
    }
  };

  // update user evaluation
  $scope.updateUserEvaluation = function () {

  };
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/controllers/navigator.js":[function(require,module,exports){
/**
 *  Navigator Controller (`NavigatorCtrl`)
 *  ======================================
 *
 *  Controls the navigation and three-way binds items.
 *
 *  ## Type lineage
 *
 *  Navigator shows items grouped by type lineage. 
 *  
 *  - Topics
 *    - Problems
 *      - Opinions
 *      - Solutions
 *        - Opinions
 *
 *
 *  ## Loading data flow
 *
 *  Navigator works by lazy loading. It does not load data until a User Event triggers it to do so. The only exception to that are topics that gets downloaded on `ng-init`
 *
 *  Data loads a default batch of 15 items with the option of loading more via User Event. Every batch downloaded stays in the Memory.
 *
 *  The function used to fetch data is {@link getTopics}.
 *
 *  ## Bootstrap
 *  
 *  We use {@link http://getbootstrap.com/javascript/#collapse| Bootstrap collapse} to expand/squeeze items and sub-items
 *
 *  ### Bootstrap integration in Scope
 *
 *  The controller listen to Bootstrap's collapse `show` and `hide` events and calls either {@link module:controllers/navigator~onCollapse} or {@link module:controllers/navigator~onCollapse}.
 * 
 *  @module controllers/navigator
 *  @prop $scope {k} - Controller's scope
 *  @prop $scope.topics {NavigatorItem[]} - Array of topics
 *  @see {@link https://docs.angularjs.org/guide/controller| Angular Documentation: Controller}
 *  @see {@link https://docs.angularjs.org/api/ng/directive/ngController| Angular Documentation: ngController}
 *  @see {@link https://docs.angularjs.org/api/ng/service/$timeout| Angular Documentation: $timeout}
 *  @see {@link http://getbootstrap.com/javascript/#collapse| Bootstrap Documentation: collapse}
 *  @example
 *    <ANY ng-controller="NavigatorCtrl" ng-init="getTopics()" />
 *  @todo Possible memory leaks with all the batch of items being kept in the Memory. Maybe defining a maximum of items?
 * @author francoisrvespa@gmail.com
*/

module.exports = function NavigatorCtrl ($scope, DataFactory, $timeout) {
  'use strict';

  var Topic = DataFactory.Topic,
    Problem = DataFactory.Problem;

  /** @function 
   *  @param {Object} evt - DOM Event
   */

  function onCollapse (evt) {

    var target = $(event.target).closest('.box'),
      targetScope = angular.element(target).scope();

    targetScope.$apply(function () {
        targetScope.$showButtons = false;
      });
  }

  /** @function 
   *  @param {Object} evt - DOM Event
   */

  function onExpand (evt) {
    /** Get item's info */

    var target = $(event.target).closest('.box'),
      targetScope = angular.element(target).scope();

    if ( angular.element(target).data('is-navigable') ) {
      targetScope.$apply(function () {
        targetScope.$showButtons = true;
      });
      return;
    }

    angular.element(target).data('is-navigable', true);

    if ( ! targetScope.$type ) {
      ['topic', 'problem'].forEach(function (type) {
        if ( type in targetScope ) {
          targetScope.$type = type;
        }
      });
    }

    if ( ! targetScope.$loaded ) {
      switch ( targetScope.$type ) {

        case 'topic':
          Problem.get(targetScope[targetScope.$type]._id)

            .success(function (problems) {
              targetScope.$showButtons  =   true;
              targetScope.$loaded       =   true;
              targetScope.$problems     =   problems;
            });
          break;

        case 'problem':
          
          break;
        }
    }

    else {
      targetScope.$apply(function () {
        targetScope.$showButtons = true;
      });
    }

    return console.log(targetScope);
  }

  /** Function to add listeners to Bootstrap collapse's events
   *  This function gets called upon success of {@link getTopics}
   *  @function onLoaded
   */

  function onLoaded () {
    $('.navigator .collapse')
      .on('show.bs.collapse', onExpand)
      .on('hide.bs.collapse', onCollapse);
  }

  /** @function getTopics */

  function getTopics () {
    Topic.get()
      .success(function (topics) {

        $scope.topics = topics;

        $timeout(onLoaded);
      });
  }

  $scope.getTopics = getTopics;
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/controllers/sign.js":[function(require,module,exports){
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
},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/controllers/upload.js":[function(require,module,exports){
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

var UploadCtrl = [ '$scope', '$http', '$timeout', '$upload', function UploadCtrl ($scope, $http, $timeout, $upload) {

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

module.exports = UploadCtrl;
},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/directives/charts.js":[function(require,module,exports){
/**
 * Charts directive
 * 
 * @module directives/charts
 * @prop $attr {AngularAttribute} - Element's attributes
 * @prop $attr.synCharts {string} - {CriteriaSchema}._id
 * @example
 *    <ANY data-syn-charts="{{CriteriaSchema._id}}">
 *      <SVG class="chart" />
 *    </ANY>
 * @author francoisrvespa@gmail.com
*/

module.exports = function ($timeout) {
  return {
    restrict: 'CA',

    link: function ($scope, $elem, $attr) {

      if ( $attr.synCharts ) {
        $timeout(chart, 1000);
      }

      var t1 = 0;

      /** @method chart */

      function chart () {

        if ( ! $scope.$parent.votes ) {
          t1 ++;
          if ( t1 < 10 ) {
            return;
          }
          return $timeout(chart, 1000);
        }

        var votes = $scope.$parent.votes[$attr.synCharts];

        if ( ! votes ) {
          return;
        }

        var data = [];

        for ( var number in votes.values ) {
          data.push({
            label: number,
            value: votes.values[number] * 100 / votes.total
          });
        }

        var columns = ['votes'];

        data.forEach(function (d) {
          columns.push(d.value);
        });

        if ( ! $('#chart-' + $attr.synCharts).length ) {
          return console.error('chart not found #chart-' + $attr.synCharts);
        }

        console.log('criteria', $attr.synCharts);

        var chart = c3.generate({
            bindto: '#chart-' + $attr.synCharts,

            data: {
              columns: [
                columns
              ],

              type: 'bar'
            },
            
            axis: {
              
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
            }
        });
      }
    }
  };
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/directives/get-url-title.js":[function(require,module,exports){
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

module.exports = function getUrlTitle ($http) {
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

            $scope.editor.references[0].url = $elem.val();

            $scope.editor.references[0].title = JSON.parse(data);

            $elem.data('url', $scope.editor.references[0].url);
            $elem.data('title', $scope.editor.references[0].title);
          });
      });
    }
  };
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/directives/more-less.js":[function(require,module,exports){
/**
 *  **Displays buttons to squeeze/expand long texts**
 *
 *  It actually *observes* `ng-bind` attribute. Once it gets a new non-null value, it uses that as the text to truncate. It checks if text is greater than {@link module:directives/more-less~limit}. If it's not, it does nothing. Else, it truncates the text and append to DOM a "more" button.
 * 
 * @module directives/more-less
 * @prop $scope {q} - scope
 * @prop $attr {q} - attributes
 * @example
 *    <ANY ng-bind="Possibly some long text..." data-syn-more-less>
 * @author francoisrvespa@gmail.com
*/

module.exports = function () {
  return {
    restrict: 'CA',
    link: function ($scope, $elem, $attr) {

      $attr.$observe('ngBind', function (n, o) {
        if ( n && n !== o ) {
          var des = $elem.text();

          /** @var limit {number} - Text limit */
          var limit = 100;

          if ( des.length > limit ) {
            $elem.text(des.substr(0, limit));

            var more = $('<a href="#">more</a>');
            var less = $('<a href="#">less</a>');

            /** @function _more */
            function _more () {
              more.on('click', function (e) {
                e.preventDefault();
                $elem.text(des);
                $elem.append($('<span> </span>'), less);
                _less();
                return false;
              });
            }

            /** @function _less */
            function _less () {
              less.on('click', function (e) {
                e.preventDefault();
                $elem.text(des.substr(0, limit));
                $elem.append($('<span> </span>'), more);
                _more();
                return false;
              });
            }

            _more();

            $elem.append($('<span> </span>'), more);
          }
        }
      });

    }
  };
};
},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/directives/sliders.js":[function(require,module,exports){
/**
 * `sliders` Manage sliders
 * 
 * @module synapp
 * @function directive::sliders
 * @return {AngularDirective}
 * @example
 *    <ANY data-syn-sliders>
 *      <INPUT
 *        class="slider"
 *        type="text"
 *        data-item="{{item}}"
 *        data-criteria="{{criteria}}"
 *        data-ng-model="item.$votes[criteria._id]"
 *        />
 *    </ANY>
 * @author francoisrvespa@gmail.com
*/

module.exports = function () {
  return {
    restrict: 'CA',

    link: function ($scope, $elem, $attr) {

      $scope.enableSlider = function ($last, current) {

        if ( $last ) {

          // Tooltip

          $("input.slider").slider();

          // Set value

          $('input.slider')
            .slider('setValue', 5);

          current = 5;

          // On slide stop, update scope
          
          $("input.slider").slider('on', 'slideStop', function () {

            var slider = $(this);

            if ( slider.attr('type') ) {

              var item = $scope.$parent.items
                .reduce(function (item, _item) {
                  if ( _item._id === slider.data('item') ) {
                    item = _item;
                  }
                  return item;
                }, {});

              if ( ! item.$votes ) {
                item.$votes = {};
              }

              item.$votes[slider.data('criteria')] = slider.slider('getValue');
            }
          });
        }
      };
    }
  };
};
},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/factories/Data.js":[function(require,module,exports){
/**
 * `DataFactory` Data -> monson factory
 * 
 * @module synapp
 * @method factory::data
 * @return {AngularFactory}
 * @author francoisrvespa@gmail.com
*/

module.exports = function DataFactory ($http) {

  var url = '/json/',
    batchSize = synapp['navigator batch size'];

  function Model (model) {
    this.model    = model;
    this.query    = {};
    this.sorters  = [];

    this.url = url + model + '/';
  }

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
    model: function (model) {
      return new Model(model);
    },

    Item: {
      set: function (id, set) {
        return new Model('Item')

          .addQuery({ _id: id })

          .put(JSON.stringify(set));
      },

      evaluate: function (id) {
        return new Model('Item')

          .action('evaluate')

          .params([id])

          .get();
      },

      get: function (id) {
        return new Model('Item')

          .action('details')

          .params([id])

          .get();
      }
    },

    Topic: {
      get: function () {
        return new Model('Item')

          .addQuery({ type: 'Topic' })

          .sort('promotions', true)

          .limit(batchSize)

          .get();
      }
    },

    Problem: {
      get: function (topic) {
        return new Model('Item')

          .addQuery({
            type: 'Problem',
            parent: topic
          })

          .sort('promotions', true)

          .limit(batchSize)

          .get();
      }
    },

    Feedback: {
      create: function (itemId, feedback) {
        return new Model('Feedback')

          .post({
            item: itemId,
            feedback: feedback
          });
      }
    }
  };
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/factories/User.js":[function(require,module,exports){
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

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/filters/cloudinary-transformation.js":[function(require,module,exports){
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
        '/image/upload/t_media_lib_thumb/$2.jpg');
    }
  }

  return cloudinaryTransformation;
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/filters/from-now.js":[function(require,module,exports){
/**
 * `fromNowFilter` return a moment().fromNow()
 * 
 * @module filters/from-now
 * @example
 *    <!-- HTML -->
 *    <ANY ng-bind='new Date(2014) | fromNowFilter' />
 *    
 *    // JS
 *    var fromNow = fromNowFilter();
 * @author francoisrvespa@gmail.com
*/

module.exports = function fromNowFilter () {

  /** @method fromNow
   * @param date {?Date}
   * @return {?Moment}
  */
  function fromNow (date) {
    return moment(date).format('ddd DD MMM YY HH:mm:ss');
  }

  return fromNow;
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/filters/get-currently-evaluated.js":[function(require,module,exports){
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
      
      current.push(items[0]);

      if ( items[1] ) {
        current.push(items[1]);
      }
    }

    return current;
  }

  return getCurrentlyEvaluated;
};

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/filters/get-promoted-percentage.js":[function(require,module,exports){
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

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/filters/shorten.js":[function(require,module,exports){
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

},{}],"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/index.js":[function(require,module,exports){
/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  var synapp = angular.module('synapp', angular_deps);

  /** Filters */

  synapp.filter({
    shortenFilter:                require('./filters/shorten'),
    fromNowFilter:                require('./filters/from-now'),
    getCurrentlyEvaluatedFilter:  require('./filters/get-currently-evaluated'),
    getPromotedPercentageFilter:  require('./filters/get-promoted-percentage'),
    cloudinaryTransformationFilter:
                                  require('./filters/cloudinary-transformation')
  });

  /** Factories */

  synapp.factory({
    DataFactory:                  require('./factories/Data'),
    UserFactory:                  require('./factories/User')
  });

  /** Controllers */

  synapp.controller({
    UploadCtrl:                   require('./controllers/upload'),
    SignCtrl:                     require('./controllers/sign'),
    NavigatorCtrl:                require('./controllers/navigator'),
    EditorCtrl:                   require('./controllers/editor'),
    EvaluatorCtrl:                require('./controllers/evaluator'),
    DetailsCtrl:                  require('./controllers/details')
  });

  /** Directives */

  synapp.directive({
    synGetUrlTitle:               require('./directives/get-url-title'),
    synSliders:                   require('./directives/sliders'),
    synCharts:                    require('./directives/charts'),
    synMoreLess:                  require('./directives/more-less')
  });
  
})();

},{"./controllers/details":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/controllers/details.js","./controllers/editor":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/controllers/editor.js","./controllers/evaluator":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/controllers/evaluator.js","./controllers/navigator":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/controllers/navigator.js","./controllers/sign":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/controllers/sign.js","./controllers/upload":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/controllers/upload.js","./directives/charts":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/directives/charts.js","./directives/get-url-title":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/directives/get-url-title.js","./directives/more-less":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/directives/more-less.js","./directives/sliders":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/directives/sliders.js","./factories/Data":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/factories/Data.js","./factories/User":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/factories/User.js","./filters/cloudinary-transformation":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/filters/cloudinary-transformation.js","./filters/from-now":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/filters/from-now.js","./filters/get-currently-evaluated":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/filters/get-currently-evaluated.js","./filters/get-promoted-percentage":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/filters/get-promoted-percentage.js","./filters/shorten":"/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/filters/shorten.js"}]},{},["/home/francois/Dev/elance/synappalpha/public/js/angular/synapp/index.js"]);
