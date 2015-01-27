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
      luigi('tpl-promote')

        .controller(function (view) {

          var item = $('#item-' + evaluation.item);

          if ( ! item.length ) {
            console.log('item not found');
          }

          var $evaluator = item.find('>.is-section >.collapsers >.evaluator >.is-section');

          $evaluator
            .append(view);

        })

        .controller(div.controller('render')(evaluation));
    });

  }

  module.exports = getEvaluation;

} ();
