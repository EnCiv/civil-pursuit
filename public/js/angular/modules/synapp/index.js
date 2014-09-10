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
      'CriteriaFactory':      require('./factory/Criteria')
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
      'synappSummary':        require('./directive/summary')
    });
  
})();
