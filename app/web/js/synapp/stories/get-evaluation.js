! function () {

  'use strict';

  function getEvaluation () {
    var app = this;

    app.emitter('socket').on('got evaluation',
      function (evaluation) {
        evaluation.cursor = 1;
        evaluation.limit = 5;

        if ( evaluation.items.length < 6 ) {
          evaluation.limit = evaluation.items.length - 1;

          if ( ! evaluation.limit && evaluation.items.length === 1 ) {
            evaluation.limit = 1;
          }
        }

        app.model('evaluations').push(evaluation);
      });

    app.on('push evaluations', function (evaluation) {
      app.render('evaluation', evaluation);
    });
  }

  module.exports = getEvaluation;

} ();
