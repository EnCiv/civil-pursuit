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

    CriteriaFactory           :     require('./factories/Criteria')
  
  });

  // DATA DIRECTIVES

  synapp.directive({
    synappDataTopics:         require('./directives/data/topics'),
    synappDataEntries:        require('./directives/data/entries'),
    synappDataEvaluations:    require('./directives/data/evaluations'),

    // criterias

    synappDataCriterias       :      require('./directives/data/criterias')
  });

  // UTILITY DIRECTIVES

  synapp.directive({
    synappUtilImport      :   require('./directives/util/import'),
    synappUtilUrlToTitle  :   require('./directives/util/url-to-title'),

    // sliders

    synappUtilSliders         :       require('./directives/util/sliders'),

    // add a view to entry from evaluation

    synappUtilAddEntryView    :       require('./directives/util/add-entry-view')
  });

  // CONTROLLERS

  synapp.controller({
    AppCtrl:                  require('./controllers/app'),
    SignCtrl:                 require('./controllers/sign'),
    UploadCtrl:               require('./controllers/upload'),
    EntryCtrl:                require('./controllers/entry'),

    // Evaluation Controller
    EvaluationCtrl            :       require('./controllers/evaluation')
  });

  // // DIRECTIVES

  // synapp.directive({
  //   'synappUrlToTitle':       require('./directives/util/url2title'),
  //   'synappCharts':           require('./directives/util/charts')
  // });
  
})();
