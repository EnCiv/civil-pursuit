! function () {

  'use strict';

  var luigi = require('/home/francois/Dev/luigi/luigi');

  function getEvaluation () {
    var div = this;

    var Socket = div.root.emitter('socket');
    var Panel = div.root.extension('Panel');

    Socket.on('got evaluation', function (evaluation) {

      evaluation.cursor = 1;
      evaluation.limit = 5;

      if ( evaluation.items.length < 6 ) {
        evaluation.limit = evaluation.items.length - 1;

        if ( ! evaluation.limit && evaluation.items.length === 1 ) {
          evaluation.limit = 1;
        }
      }

      div.push('evaluations', evaluation);

    });

    div.watch.on('push evaluations', function (evaluation) {

      var $promote = $('#item-' + evaluation.item + ' >.collapsers >.evaluator');

      console.info('render evaluation', evaluation.item);

      luigi($promote)

        .controller(div.controller('render')(evaluation));
    });

  }

  module.exports = getEvaluation;

} ();
