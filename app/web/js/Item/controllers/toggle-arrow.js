! function () {

  'use strict';

  function toggleArrow ($target, item) {

    var div       =   this;
    var Panel     =   div.root.extension('Panel');

    var $panel    =   $target.closest('.panel');
    var $item     =   $target.closest('.item');
    var $children =   $item.find('>.collapsers >.children');

    // Animation in progress - don't do nothing

    if ( $children.hasClass('is-showing') || $children.hasClass('is-hiding') ) {
      return;
    }

    // Is shown so hide
    
    else if ( $children.hasClass('is-shown') ) {
      Panel.controller('scroll to point of attention')($item,
        function () {
          Panel.controller('hide')($children);

          $target.find('i.fa')
            .removeClass('fa-arrow-up')
            .addClass('fa-arrow-down');

        }.bind(this));
    }

    // else, show

    else {
      div.controller('expand')(item, $panel, $item, $children, $target);
    }
  }

  module.exports = toggleArrow;

} ();
