(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    console.log($scope.selectedFiles);
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
},{}],2:[function(require,module,exports){
module.exports = function () {
  return {
    restrict: 'C',
    
    link: function ($scope, $elem, $attrs) {
      $scope.raise = function (alert) {

        if ( typeof alert === 'string' ) {
          $scope.warning = alert;
          return;
        }

        if ( alert.error ) {
          // ---- If Error has a declared status code ----------------------------------------  //
          if ( alert.error.statusCode ) {
            // ---- Show specific alerts depending on HTTP status code -----------------------  //
            switch ( alert.error.statusCode ) {
              // ---- on 401 error it meaans wrong password ----------------------------------  //
              case 401:
                $scope.warning = 'Wrong password';
                $scope.create.password = '';
                return;
              // ---- on 404 error it meaans credentias not found ----------------------------  //
              case 404:
                $scope.warning = 'Credentials not found';
                return;
            }
          }
          // ---- Show specific alerts depending on error names ------------------------------  //
          switch ( alert.error.name ) {
            case 'ValidationError':
            case 'AssertionError':
              $scope.warning = 'Invalid credentials';
              break;

            default:
              $scope.warning = 'Something went wrong. Try again in a moment.';
              break;
          }
        }
      };
    }
  };
};
},{}],3:[function(require,module,exports){
// .synapp-create

module.exports = function (EntryFactory, TopicFactory, SignFactory, EvaluationFactory, $http) {
  return {

    restrict: 'C',

    link: function ($scope, $elem, $attrs) {

      // If entry attribute is defined, get entry

      if ( $attrs.entry ) {
        EntryFactory.findById($attrs.entry)
          .success(function (entry) {
            $scope.topic = entry.topic;
            $scope.entry = entry;
          })
      }

      // Function to clear the form

      $scope.clear = function () {
        $scope.entry.title        = '';
        $scope.entry.subject      = '';
        $scope.entry.description  = '';
        $scope.dataUrls           = [];
        
      }

      // Behavior to fetch URL's title

      $("[ng-model='entry.title']").on('change', function () {

        $scope.entry.url = $(this).val();

        $http.post('/tools/get-title', { url: $(this).val() })
          .error(function (error) {
            console.log(error);
          })
          .success(function (data) {
            console.log(data);
            $scope.entry.title = JSON.parse(data);
          });
      });

      // Function to publish entry

      $scope.create = function () {

        $scope.form_create.submitted = true;

        // Subject should not be empty

        if ( $scope.form_create.subject.$error.required ) {
          console.warn('Missing subject');
          return $scope.alert = 'Please enter a subject';
        }
        
        // Description should not be empty

        if ( $scope.form_create.description.$error.required ) {
          console.warn('Missing description');
          $scope.alert = 'Please enter a description';
          return;
        }

        // If entry has an _id, do a save

        if ( $scope.entry._id ) {

          // Update image if need be

          if ( Array.isArray($scope.uploadResult) && $scope.uploadResult.length ) {
            $scope.entry.image = $scope.uploadResult[0].path.split(/\//).pop();
          }

          // The update object

          var update = $scope.entry;

          // get rid of image if base64

          if ( update.image.length > 255 ) {
            delete update.image;
          }

          // Find entry by id and update it

          EntryFactory.findByIdAndUpdate($scope.entry._id, update)

            .success(function () {
              
              // Create new Evaluation

              var evaluation = {
                topic:  $scope.entry.topic,
                user:   $scope.entry.user,
                entry:  $scope.entry._id
              };

              // Create new evaluation

              EvaluationFactory.create(evaluation)

                .success(function (created) {

                  // Take user to new Evaluation

                  location.href = '/evaluate/' + created._id;
                });
            });
        }

        // Create entry

        else {
          
          // Fetch topic id by slug

          TopicFactory.findBySlug( $scope.topic )
            
            .success(function (topic) {

              // Fetch user id by email

              SignFactory
                
                .findByEmail( $scope.email )

                .success(function (user) {

                  // Create new Entry

                  var entry  = {
                    subject:      $scope.form_create.subject.$modelValue,
                    description:  $scope.form_create.description.$modelValue,
                    user:         user._id,
                    topic:        topic._id,
                    image:        Array.isArray($scope.uploadResult) && $scope.uploadResult.length ?
                                    $scope.uploadResult[0].path.split(/\//).pop() : null,
                    title:        $scope.form_create.title.$modelValue,
                    url:          $scope.form_create.url.$modelValue
                  };

                  // Call factory

                  EntryFactory.publish(entry)

                    .success(function (created) {

                      // Create new Evaluation

                      var evaluation = {
                        topic:  topic._id,
                        user:   user._id,
                        entry:  created._id
                      };

                      // Call factory

                      EvaluationFactory.create(evaluation)

                        .success(function (created) {

                          // Take user to new Evaluation

                          location.href = '/evaluate/' + created._id;
                        });
                    });
                });
            })
        }
      };
    }
  };
};

},{}],4:[function(require,module,exports){
// .synapp-entries

module.exports = function (TopicFactory, SignFactory, EntryFactory, CriteriaFactory, VoteFactory) {
  return {
    restrict: 'C',

    link: function ($scope, $elem, $attr) {

      $scope.votes = {};

      function charts (entryId) {

        var votes = $scope.votes[entryId];

        var data;

        for ( var criteria in votes ) {
          data = [];

          for ( var value in votes[criteria].values ) {
            data.push({
              label: value,
              value: votes[criteria].values[value] * 100 / votes[criteria].total
            });
          }

          chart(data, entryId, criteria);
        }
      }

      function chart (data, entryId, criteriaId) {
        console.log('data chart', data);
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 300  - margin.left - margin.right,
          height = 70 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

        var y = d3.scale.linear()
          .range([height, 0]);

        var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

        var chart = d3.select("#chart-" + entryId + '-' + criteriaId)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function (d) {
          return d.label;
        }));

        y.domain([0, d3.max(data, function(d) { return d.value; })]);

        chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        chart.selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.label); })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .attr("width", x.rangeBand());

/*        var barWidth = width / data.length;

        var bar = chart.selectAll("g")
          .data(data)
          .enter().append("g")
          .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

        bar.append("rect")
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); })
          .attr("width", barWidth - 1);

        bar.append("text")
          .attr("x", barWidth / 2)
          .attr("y", function(d) { return y(d.value) + 3; })
          .attr("dy", ".75em")
          .text(function(d) { return d.value; });*/
      }

      function type(d) {
        d.frequency = +d.frequency;
        return d;
      }

      function findTopicBySlug (cb) {
        TopicFactory.findBySlug($attr.topic)

          .success(function (topic) {
            $scope.topic = topic;
            cb();
          });
      }

      function findTopicById (cb) {
        TopicFactory.findById($scope.entry.topic)

          .success(function (topic) {
            $scope.topic = topic;
            cb();
          });
      }

      function findUserByEmail (cb) {
        SignFactory.findByEmail($attr.user)

          .success(function (user) {
            $scope.user = user;
            cb();
          });
      }

      function findCriterias (cb) {
        CriteriaFactory.find()

          .success(function (criterias) {
            $scope.criterias = criterias;
            cb();
          });
      }

      function findEntryVotes (entry, cb) {
        VoteFactory.getAccumulation(entry)

          .success(function (votes) {
            $scope.votes[entry] = votes;
            cb();
          });
      }

      function findEntries (cb) {
        EntryFactory.find({
          topic:  $scope.topic._id,
          user:   $scope.user ? $scope.user._id : null
        })

          .success(function (entries) {

            entries = entries.map(function (entry) {
              entry.promoted = Math.ceil(entry.promotions * 100 / entry.views);
              return entry;
            });

            entries.sort(function (a,b) {
              if ( a.promoted > b.promoted ) {
                return -1;
              }
              if ( a.promoted < b.promoted ) {
                return 1;
              }
              return 0;
            });

            $scope.entries = entries;
            cb();
          });
      }

      function findEntry (cb) {
        EntryFactory.findById($attr.entry)

          .success(function (entry) {
            $scope.entry = entry;
            cb();
          });
      }

      // FLOW

      flow();

      function flow () {

        if ( $attr.entry ) {
          findEntry(function () {
            console.log('entry', $scope.entry);
            findTopicById(function () {
              console.log('topic', $scope.topic);
            });
          });
        }

        else {
          findTopicBySlug(function () {

            if ( $attr.user ) {
              
              findUserByEmail(function () {
                
                findCriterias(function () {

                  findEntries(function () {
                    
                    $scope.entries.forEach(function (entry) {
                      findEntryVotes(entry._id, function () {
                        charts(entry._id);
                      });
                    });

                  });
                });
              });
            }

            else {
              
              findCriterias(function () {

                findEntries(function () {
                  
                  $scope.entries.forEach(function (entry) {
                    findEntryVotes(entry._id, function () {
                      charts(entry._id);
                    });
                  });

                });
              });
            }

          });
        }
      }
    }
  };
};
},{}],5:[function(require,module,exports){
// .synapp-evaluate

module.exports = function (EvaluationFactory, CriteriaFactory, VoteFactory, SignFactory, EntryFactory) {
  return {
    
    // Restrict to class

    restrict: 'C',
    
    link: function ($scope, $elem, $attrs) {

      $scope.criterias      = [];

      $scope.evaluate       = {};

      $scope.evaluationDone = false;

      $scope.comparing      = [];

      $scope.comparable     = [0, 1, 2, 3, 4, 5];

      $scope.votes          = {};

      $scope.getFlow        = [0, 2];

      // Get criterias

      $scope.getCriterias   = function (cb) {
        CriteriaFactory.find()

          .success(function (criterias) {
            $scope.criterias = criterias;

            cb();
          });
      };

      // Get Evaluation

      $scope.getEvaluation = function (cb) {

        EvaluationFactory.findById($attrs.id)

          .success(function (evaluation) {

            evaluation.entries  = evaluation.entries
              .map(function (entry) {
                $scope.votes[entry._id._id] = {};

                EntryFactory.view(entry._id._id);

                return entry._id;
              });
              
            $scope.evaluate     = evaluation;

            $scope.left         = evaluation.entries[0];
            $scope.right        = evaluation.entries[1];

            $scope.comparing    = [0, 1];

            cb();

          });
      };

      //
      $scope.enableSlider = function ($last) {
        if ( $last ) {
          $("input.slider").slider({
            formatter: function(value) {
              return 'Current value: ' + value;
            }
          });
          $("input.slider").slider('on', 'slideStop', function () {
            if ( $(this).attr('type') ) {

              $scope.votes[$(this).data('entry')][$(this).data('criteria')] =
                $(this).slider('getValue');

              $scope.$apply();

              console.log('votes updated', $scope.votes);
            }
          });
        }
      };

      // Promote

      /**
        * @abstract     Promote entry (increment schema path `promotions` of Entry)
        * @param
        *   @entry
        *       @type   String
      **/

      $scope.promote = function (entry, position) {

        console.info('Promoting entry', position);

        EntryFactory.promote(entry)
          .success(function (data) {

            var newEntryPosition;

            // Promoting left entry

            if ( position === 'left' ) {
              $scope.comparable.splice($scope.comparable.indexOf($scope.comparing[1]), 1);

              newEntryPosition = Math.min.apply(null, 
                $scope.comparable.filter(function (x) {
                  return x !== $scope.comparing[0];
                }));

              if ( newEntryPosition === Number.POSITIVE_INFINITY ) {
                $scope.evaluationDone = true;
                return;
              }

              $scope.comparing[1] = newEntryPosition;

              // Save votes

              $scope.saveVote($scope.right);

              $scope.right = $scope.evaluate.entries[newEntryPosition];
            }

            else if ( position === 'right' ) {
              $scope.comparable.splice($scope.comparable.indexOf($scope.comparing[0]), 1);

              newEntryPosition = Math.min.apply(null, 
                $scope.comparable.filter(function (x) {
                  return x !== $scope.comparing[1];
                }));

              if ( newEntryPosition === Number.POSITIVE_INFINITY ) {
                $scope.evaluationDone = true;
                return;
              }

              $scope.comparing[0] = newEntryPosition;

              $scope.left = $scope.evaluate.entries[newEntryPosition];
            }
            
          });
      };

      // Continue

      $scope.continue = function () {
        $scope.comparable = $scope.comparable.filter(function (num) {
          return num > Math.max.apply(null, $scope.comparing);
        });

        if ( ! $scope.comparable.length ) {
          $scope.evaluationDone = true;
          return console.warn('end');
        }

        $scope.comparing  = [$scope.comparable[0], $scope.comparable[1]];

        $scope.left       = $scope.evaluate.entries[$scope.comparing[0]];
        $scope.right      = $scope.evaluate.entries[$scope.comparing[1]];
      };

      // Edit and go again

      $scope.editAndGoAgain = function () {
        location.href='/edit/' + $scope.evaluate.entry;
      };

      // Save vote

      $scope.saveVote = function (entry) {
        var votes = [];

        for ( var criteria in $scope.votes[entry._id] ) {
          votes.push({
            entry: entry._id,
            criteria: criteria,
            value: +$scope.votes[entry._id][criteria]
          });
        }

        $('input.slider[data-entry="' + entry._id + '"]')
          .slider('setValue', 5);

        SignFactory.findByEmail($scope.email)

          .success(function (user) {

            votes = votes.map(function (vote) {
              vote.user = user._id;

              return vote;
            });

            VoteFactory
              .create(votes);
          });
      };

      // ============================
      // FLOW
      // ===================

      console.info('get evaluation');
      $scope.getEvaluation(function () {
        console.info('get criterias');
        $scope.getCriterias(function () {
          $scope.evaluate.entries.forEach(function (entry) {
            $scope.votes[entry._id] = {};

            $scope.criterias.forEach(function (criteria) {
              $scope.votes[entry._id][criteria._id] = 5;

              // tooltips

              setTimeout(function () {
                $('[data-toggle="tooltip"]').tooltip({
                  placement: 'top'
                });
                console.log('hola')
              }, 1000)
            });
          });
        });
      });
    }
  };
};
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
module.exports = function (EntryFactory, TopicFactory, CriteriaFactory) {
  return {
    restrict: 'C',
    link: function ($scope, $elem, $attrs) {

      var entry = $attrs.entry;

      EntryFactory.findById(entry)

        .success(function (entry) {
          $scope.entry = entry;

          TopicFactory.findById($scope.entry.topic)

            .success(function (topic) {
              $scope.topic = topic;
            });
        });

      CriteriaFactory.find()

        .success(function (criterias) {
          $scope.criterias = criterias;
        });
    }
  };
};
},{}],8:[function(require,module,exports){
// .synapp-topics

module.exports = function (TopicFactory, EvaluationFactory, SignFactory) {

  return {

    restrict: 'C',

    link: function ($scope) {
      $scope.selectedTopic =  'none';

      // select a topic

      $scope.selectMeAsTopic = function (id) {
        $scope.selectedTopic = id;
      };

      // Create a new evaluation and take user there

      $scope.evaluate = function (topicSlug) {
        TopicFactory.findBySlug(topicSlug)

          .success(function (topic) {

            SignFactory.findByEmail($scope.email)

              .success(function (user) {
                EvaluationFactory.create({
                  topic:    topic._id,
                  user:     user._id
                })

                  .success(function (created) {
                    location.href = '/evaluate/' + created._id;
                  });
              });
          });
      };

      // Get topics

      TopicFactory.find()
        .error(function (error) {
          console.error(error);
        })
        .success(function (topics) {
          $scope.topics = topics;
        });
    }
  };
};
},{}],9:[function(require,module,exports){
module.exports = function ($http) {
  return {
    find: function () {
      return $http.get('/json/Criteria');
    }
  };
};
},{}],10:[function(require,module,exports){
module.exports = function ($http) {
  return {
    find: function (query) {
      var url = '/json/Entry';

      var params = [];

      if ( query && Object.keys(query).length ) {
        for ( var q in query ) {
          params.push([q,query[q]].join('='));
        }
      }

      if ( params.length ) {
        url += '?' + params.join('&');
      }

      return $http.get(url);
    },

    findById: function (id) {
      return $http.get('/json/Entry/findById/' + id);
    },

    findByIdAndUpdate: function (id, entry) {
      return $http.put('/json/Entry/statics/updateById/' + id, entry);
    },

    evaluate: function (topic) {
      return $http.get('/json/Entry/statics/evaluate/' + topic);
    },

    publish: function (entry) {
      return $http.post('/json/Entry', entry);
    },

    view: function (entry) {
      return $http.put('/json/Entry?_id=' + entry, JSON.stringify({ "$inc": { views: 1 } }) );
    },

    promote: function (entry) {
      return $http.put('/json/Entry?_id=' + entry, JSON.stringify({ "$inc": { promotions: 1 } }) );
    }
  };
};
},{}],11:[function(require,module,exports){
module.exports = function ($http) {
  return {
    create: function (evaluation) {
      return $http.post('/json/Evaluation', evaluation);
    },

    findById: function (id) {
      return $http.get('/json/Evaluation/findById/' + id + '?$populate=topic entries._id');
    },

    promote: function (id, entry) {
      return $http.get('/json/Evaluation/statics/promote/' + id + '/' + entry);
    }
  };
};
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
module.exports = function ($http) {
  return {
    find: function () {
      return $http.get('/json/Topic');
    },

    findBySlug: function (slug) {
      return $http.get('/json/Topic/findOne?slug=' + slug);
    },

    findById: function (id) {
      return $http.get('/json/Topic/findById/' + id);
    }
  };
};
},{}],14:[function(require,module,exports){
module.exports = function ($http) {
  return {
    create: function (vote) {
      return $http.post('/json/Vote', vote);
    },

    findByEntries: function (entries) {

      entries = entries.map(function (entry) {
        if ( typeof entry === 'string' ) {
          return entry;
        }

        return entry._id;
      })

      return $http.put('/json/Vote/statics/findByEntries', entries);
    },

    getAccumulation: function (entry) {
      return $http.get('/json/Vote/statics/getAccumulation/' + entry);
    }
  };
};
},{}],15:[function(require,module,exports){
;(function () {
  
  // DEPENDENCIES

  var deps = [];

  if ( typeof createPage === 'boolean' ) {
    deps.push('angularFileUpload', 'autoGrow');
  }

  // MODULE

  angular.module('synapp', deps)

  // FACTORIES

    .factory({
      'SignFactory':          require('./factory/Sign'),
      'TopicFactory':         require('./factory/Topic'),
      'EntryFactory':         require('./factory/Entry'),
      'EvaluationFactory':    require('./factory/Evaluation'),
      'CriteriaFactory':      require('./factory/Criteria'),
      'VoteFactory':          require('./factory/Vote')
    })

  // CONTROLLERS

    .controller({
      'UploadCtrl':           require('./controller/upload')
    })

  // DIRECTIVES

    .directive({
      'synappSign':           require('./directive/sign'),
      'synappTopics':         require('./directive/topics'),
      'synappCreate':         require('./directive/create'),
      'synappEvaluate':       require('./directive/evaluate'),
      'synappAlert':          require('./directive/alert'),
      'synappSummary':        require('./directive/summary'),
      'synappEntries':        require('./directive/entries')
    });
  
})();

},{"./controller/upload":1,"./directive/alert":2,"./directive/create":3,"./directive/entries":4,"./directive/evaluate":5,"./directive/sign":6,"./directive/summary":7,"./directive/topics":8,"./factory/Criteria":9,"./factory/Entry":10,"./factory/Evaluation":11,"./factory/Sign":12,"./factory/Topic":13,"./factory/Vote":14}]},{},[15])