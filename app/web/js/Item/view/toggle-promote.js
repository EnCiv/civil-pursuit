! function () {
  
  'use strict';

  var Nav = require('../../Nav');
  var Sign = require('../../Sign');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function togglePromote () {

    if ( ! synapp.user ) {
      Sign.dialog.join();
      return;
    }

    var $trigger    =   $(this);
    var $item       =   $trigger.closest('.item');
    var item        =   $item.data('item');

    function hideOthers () {
      if ( $('.is-showing').length || $('.is-hidding').length ) {
        return false;
      }

      if ( $('.creator.is-shown').length ) {
        Nav
          .hide($('.creator.is-shown'))
          .hidden(function () {
            $trigger.click();
          });

        return false;
      }

      if ( item.find('details').hasClass('is-shown') ) {
        Nav
          .hide(item.find('details'))
          .hidden(function () {
            $trigger.click();
          });

        item.find('toggle details').find('.caret').addClass('hide');

        return false;
      }
    }

    function promote () {
      item.promote.get(app.domain.intercept(item.promote.render.bind(item.promote)));
    }

    function showHideCaret () {
      if ( item.find('promote').hasClass('is-shown') ) {
        $trigger.find('.caret').removeClass('hide');
      }
      else {
        $trigger.find('.caret').addClass('hide');
      }
    }

    if ( hideOthers() === false ) {
      return false;
    }

    if ( item.find('collapsers hidden').length ) {
      item.find('collapsers').show();
    }

    Nav.toggle(item.find('promote'), item.template, function (error) {

      if ( item.find('promote').hasClass('is-hidden') && item.find('collapsers visible').length ) {
        item.find('collapsers').hide();
      }

      promote();

      showHideCaret();

    });

  }

  module.exports = togglePromote;

} ();
