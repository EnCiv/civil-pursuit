;(function () {

  // MODULE

  var synapp = angular.module('synapp', angular_deps);

  // FILTERS

  synapp.filter({
    shorten:                  require('./filters/shorten'),
    fromNow:                  require('./filters/from-now'),

    // Reduce entries array to the 1 or 2 entries being evaluated

    currentlyEvaluated        :     require('./filters/currently-evaluated'),

    // get promotion percentage

    getPromoted               :     function () {
      return function (item) {
        if ( item ) {
          if ( ! item.promotions ) {
            return 0;
          }

          return Math.ceil(item.promotions * 100 / item.views);
        }
      }
    }
  });

  // FACTORIES

  synapp.factory({

    // Item factory

    ItemFactory           :     require('./factories/Item'),

    // User factory

    UserFactory           :     require('./factories/User'),

    // Evaluation factory

    EvaluationFactory           :     require('./factories/Evaluation'),

    // Data factory

    DataFactory           :     require('./factories/Data')
  
  });


  // UTILITY DIRECTIVES

  synapp.directive({
    synappUtilImport      :   require('./directives/util/import'),
    synappUtilUrlToTitle  :   require('./directives/util/url-to-title'),

    // sliders

    synappUtilSliders         :       require('./directives/util/sliders'),

    // add a view to entry from evaluation

    synappUtilAddEntryView    :       require('./directives/util/add-entry-view'),

    // d3 charts

    synappUtilCharts          :       require('./directives/util/charts'),

    syNavItemDescription      :       function () {
      return {
        restrict: 'C',
        link: function ($scope, $elem, $attr) {

          $attr.$observe('ngBind', function (n, o) {
            if ( n && n !== o ) {
              var des = $elem.text();

              var limit = 100;

              if ( des.length > limit ) {
                $elem.text(des.substr(0, limit));

                var more = $('<a href="#">more</a>');
                var less = $('<a href="#">less</a>');

                function _more () {
                  more.on('click', function (e) {
                    e.preventDefault();
                    $elem.text(des);
                    $elem.append($('<span> </span>'), less);
                    _less();
                    return false;
                  });
                }

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
    }
  });

  // CONTROLLERS

  synapp.controller({
    AppCtrl:                  require('./controllers/app'),
    UploadCtrl:               require('./controllers/upload'),
    SignCtrl:               require('./controllers/sign'),

    // Navigator Controller
    NavigatorCtrl             :       function ($scope, DataFactory, $timeout) {

      var Topic = DataFactory.Topic,
        Problem = DataFactory.Problem;

      $scope.navigator = {};

      $timeout(function () {
        $('.more').on('click', function (e) {
          var item = $(this).data('item');
          item.$maxChars = 1000;
          angular.element($(this)).scope().$digest();
          e.preventDefault();
          return false;
        });
      }, 250);

      $scope.moreLess = function (is) {
        $timeout(function () {
          is.$maxChars = 1000;
        }, 250);
        return false;
      };

      Topic.get()
        .success(function (data) {
          $scope.topics = data;

          $timeout(function () {
            $('.navigator .collapse').on('show.bs.collapse', function (evt) {
              var bits = $(evt.target).attr('id').split('-');

              var type = bits[0];
              var id = bits[1];
              var has = bits[2];

              var is = $scope[type].filter(function (t) {
                return t._id === id;
              });

              if ( is.length ) {
                is = is[0];

                if ( ! is.$loaded ) {
                  switch ( type ) {
                    case 'topics':
                      Problem.get(id)

                        .success(function (problems) {
                          is.$problems = problems;
                          is.$loaded = true;
                        });
                      break;
                  }
                }
              }

            });
          });
        });
    },

    // Editor Controller
    EditorCtrl                :       function ($scope, ItemFactory, EvaluationFactory, DataFactory, $timeout) {

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

          console.log('obj', obj)

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
    },

    // Evaluator Controller
    EvaluatorCtrl             :       function ($scope, DataFactory, $timeout) {
      
      var Item = DataFactory.Item;

      $scope.evaluator  = {
        cursor: 1,
        limit: 5
      };

      function onChange () {

        if ( $scope.items.length < 6 ) {
              $scope.evaluator.limit = $scope.items.length - 1;
            }

        // Add views counter

        if ( $scope.items[0] ) {
          $scope.addView($scope.items[0]);
        }

        if ( $scope.items[1] ) {
          $scope.addView($scope.items[1]);
        }
      }

      // fetch evaluation
      $timeout(function () {

        return Item.evaluate($scope.item)
          
          .ok(function (evaluation) {
            console.log(evaluation)
            
            $scope.items = evaluation.items;

            $scope.criterias = evaluation.criterias;
            
            onChange();
          });
      });

      // add view

      $scope.addView = function (item) {
        Item.set(item._id, { $inc: { views: 1 } });
      };

      // 

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

      // promote

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
        if ( $scope.evaluator.cursor > $scope.evaluator.limit && $scope.evaluator.limit === 2 ) {
          $scope.evaluator.cursor = 2;
        }
      };

      // finish
      $scope.finish = function () {
        if ( $scope.item ) {
          location.href = '/summary/' + $scope.item;
        }
      };

      // update user evaluation
      $scope.updateUserEvaluation = function () {

      };
    }
  });

  // // DIRECTIVES

  // synapp.directive({
  //   'synappUrlToTitle':       require('./directives/util/url2title'),
  //   'synappCharts':           require('./directives/util/charts')
  // });
  
})();
