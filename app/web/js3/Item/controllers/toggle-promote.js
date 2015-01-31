! function () {

  'use strict';

  function togglePromote ($target, view, item) {
    var div       =   this;
    var Panel     =   div.root.extension('Panel');
    var Promote   =   div.root.extension('Promote');
    var Socket    =   div.root.emitter('socket');

    var $panel    =   $target.closest('.panel');
    var $item     =   $target.closest('.item');
    var $promote  =   $item.find('>.collapsers >.evaluator');

    if ( $promote.hasClass('is-showing') || $promote.hasClass('is-hiding') ) {
      return false;
    }

    else if ( $promote.hasClass('is-shown') ) {
      Panel.controller('scroll to point of attention')($item,
        function () {
          Panel.controller('hide')($promote);
        });
    }

    else {
      // Show tip

      $('#modal-tip-evaluate').modal('show');

      Panel.controller('reveal')($promote, view,
        
        function onPromoteShown () {

          var evaluationExists = Promote.model('evaluations')
            .some(function (evaluation) {
              return evaluation.item === item._id;
            });

          if ( ! evaluationExists ) {
            Socket.emit('get evaluation', item);
          }

        });
    }

    return false;
  }

  module.exports = togglePromote;

} ();
