! function () {

  'use strict';

  function getEvaluation () {
    var app = this;

    var Socket = app.root.emitter('socket');
    var Queue = app.root.queue;

    Socket.on('got evaluation',
      function (evaluation) {
        evaluation.cursor = 1;
        evaluation.limit = 5;

        if ( evaluation.items.length < 6 ) {
          evaluation.limit = evaluation.items.length - 1;

          if ( ! evaluation.limit && evaluation.items.length === 1 ) {
            evaluation.limit = 1;
          }
        }

        Queue.add(function Promote__push_evaluation (next) {
          app.push('evaluations', evaluation);
          next();
        });
      });

    app.watch.on('push evaluations', function (evaluation) {
      // app.render('evaluation', evaluation, function ($promote) {
        
      // });
    });

  }

  module.exports = getEvaluation;

} ();
