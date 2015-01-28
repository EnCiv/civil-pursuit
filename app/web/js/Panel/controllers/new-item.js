! function () {

  'use strict';

  function newItem ($creator, $panel, item) {

    var div     =   this;
    var Socket  =   div.root.emitter('socket');
    var Panel   =   div.root.extension('Panel');

    Panel.controller('hide')($creator, function () {
      luigi('tpl-item')
        .controller(function ($item) {

          var image = $creator.find('.item-media img');

          if ( image.length ) {
            $item.find('.item-media img')
              .attr('src', image.attr('src'));
          }

          $panel.find('.new-item:first').append($item);

          Panel.controller('reveal')($panel.find('.new-item:first'),
            $panel, function () {
              $item.addClass('is-new');
              $item.insertAfter($panel.find('.new-item:first'));
              $panel.find('.new-item:first').empty().hide();

              Socket.emit('create item', item);
            });
        });
    });
  }

  module.exports = newItem;

} ();
