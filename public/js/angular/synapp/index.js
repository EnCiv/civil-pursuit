;(function () {

  // MODULE

  var synapp = angular.module('synapp', angular_deps);

  // FILTERS

  synapp.filter({
    shorten:                  require('./filters/shorten'),
    fromNow:                  require('./filters/from-now'),

    // Reduce entries array to the 1 or 2 entries being evaluated

    currentlyEvaluated        :     require('./filters/currently-evaluated')
  });

  // FACTORIES

  synapp.factory({

    // Topic factory

    TopicFactory              :     require('./factories/Topic'),

    // User factory

    UserFactory               :     require('./factories/User'),

    // Entry factory

    EntryFactory              :     require('./factories/Entry'),

    // Evaluation factory

    EvaluationFactory         :     require('./factories/Evaluation'),

    // Criteria factory

    CriteriaFactory           :     require('./factories/Criteria'),

    // Vote factory

    VoteFactory               :     require('./factories/Vote'),

    // Feedback factory

    FeedbackFactory           :     require('./factories/Feedback'),

    // Item factory

    ItemFactory           :     require('./factories/Item')
  
  });

  // DATA DIRECTIVES

  synapp.directive({

    // topics

    synappDataTopics:         require('./directives/data/topics'),

    // entries

    synappDataEntries:        require('./directives/data/entries'),

    // evaluations

    synappDataEvaluations     :       require('./directives/data/evaluations'),

    // criterias

    synappDataCriterias       :       require('./directives/data/criterias'),

    // feedbacks

    synappDataFeedbacks       :       require('./directives/data/feedbacks'),

    // votes

    synappDataVotes           :       require('./directives/data/votes')
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
    SignCtrl:                 require('./controllers/sign'),
    UploadCtrl:               require('./controllers/upload'),
    EntryCtrl:                require('./controllers/entry'),

    // Evaluation Controller
    EvaluationCtrl            :       require('./controllers/evaluation'),

    // Accordion Controller
    AccordionCtrl             :       function ($scope, ItemFactory, $timeout) {
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

            });
          });
        });
    }
  });

  // // DIRECTIVES

  // synapp.directive({
  //   'synappUrlToTitle':       require('./directives/util/url2title'),
  //   'synappCharts':           require('./directives/util/charts')
  // });
  
})();
