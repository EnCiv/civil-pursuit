module.exports = function ($scope, EntryFactory, EvaluationFactory, UserFactory) {

  $scope.entry = $scope.entry || {};

  function getImage () {
    if ( Array.isArray($scope.uploadResult) && $scope.uploadResult.length ) {
      return $scope.uploadResult[0].path.split(/\//).pop();
    }
  }

  function create (cb) {
    var entry = {
      topic               :   $scope.topic,
      user                :   $scope.email,
      subject             :   $scope.entry.subject,
      url                 :   $scope.entry.url,
      title               :   $scope.entry.title,
      description         :   $scope.entry.description,
      image               :   getImage()
    };

    EntryFactory.create(entry)

      .success(function(entry) {
        $scope.entry = entry;

        cb();
      });
  }

  function edit (cb) {
    var entry = {
      topic               :   $scope.topic._id,
      subject             :   $scope.entry.subject,
      url                 :   $scope.entry.url,
      title               :   $scope.entry.title,
      description         :   $scope.entry.description,
      image               :   getImage()
    };

    UserFactory.findByEmail($scope.email)

      .success(function (user) {
        entry.user = user._id;

        EntryFactory.findByIdAndUpdate($scope.entry._id, entry)

          .success(function(entry) {
            cb();
          });
      })

  }

  function createEvaluation (cb) {
    var evaluation = {
      topic:    typeof $scope.topic === 'string' ? $scope.topic : $scope.topic.slug,
      user:     $scope.email,
      entry:    $scope.entry._id
    };

    EvaluationFactory.create(evaluation)

      .success(function (evaluation) {
        $scope.evaluation = evaluation;

        cb();
      });
  }

  function goToEvaluation () {
    location.href = '/evaluate/' + $scope.evaluation._id;
  }

  // Function to clear the form

  $scope.clearEntry = function () {
    $scope.entry.title        = '';
    $scope.entry.subject      = '';
    $scope.entry.description  = '';
    $scope.dataUrls           = [];
  }

  // Function to publish entry

  $scope.saveEntry = function () {

    $scope.form_create.submitted = true;

    $scope.alert = false;

    // Subject should not be empty

    if ( $scope.form_create.subject.$error.required ) {
      return $scope.alert = 'Please enter a subject';
    }
    
    // Description should not be empty

    if ( $scope.form_create.description.$error.required ) {
      $scope.alert = 'Please enter a description';
      return;
    }

    console.log(($scope.entry && $scope.entry._id) ? 'edit':'create');



    // If entry has an _id, do a save

    if ( $scope.entry && $scope.entry._id ) {

      return serie.callbacks(edit, createEvaluation, goToEvaluation);

    }

    // Create entry

    else {

      return serie.callbacks(create, createEvaluation, goToEvaluation);
    }
  };
};