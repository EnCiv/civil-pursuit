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

    UserFactory           :     require('./factories/User')
  
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

    synappUtilCharts          :       require('./directives/util/charts')
  });

  // CONTROLLERS

  synapp.controller({
    AppCtrl:                  require('./controllers/app'),
    UploadCtrl:               require('./controllers/upload'),
    SignCtrl:               require('./controllers/sign'),

    // Accordion Controller
    NavigatorCtrl             :       function ($scope, ItemFactory, $timeout) {
      $scope.navigator = {};

      $scope.moreLess = function (is) {
        $timeout(function () {
          is.$maxChars = 1000;
        }, 250);
        return false;
      };

      ItemFactory.findTopics()
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
                      ItemFactory.findProblems({ parent: id })

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

    // Item Controller
    EditorCtrl                  :       function ($scope, ItemFactory) {

      function getImage () {
        if ( Array.isArray($scope.uploadResult) && $scope.uploadResult.length ) {
          return $scope.uploadResult[0].path.split(/\//).pop();
        }
      }

      $scope.editor = {
        $save: function () {
          
          this.$error = null;

          if ( ! $scope.editor.subject ) {
            return this.$error = 'Please enter a subject';
          }

          if ( ! $scope.editor.description ) {
            return this.$error = 'Please enter a description';
          }

          var obj = {};

          for ( var key in $scope.editor ) {
            if ( ! /^\$/.test(key) ) {
              obj[key] = $scope.editor[key];
            }
          }

          obj.image = getImage();

          console.log(obj);

          ItemFactory.insert(obj)
            .success(function () {
              location.href = '/';
            });
        }
      };
    }
  });

  // // DIRECTIVES

  // synapp.directive({
  //   'synappUrlToTitle':       require('./directives/util/url2title'),
  //   'synappCharts':           require('./directives/util/charts')
  // });
  
})();
