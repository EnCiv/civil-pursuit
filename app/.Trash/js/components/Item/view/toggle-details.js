! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function toggleDetails () {
    var $trigger    =   $(this);
    var $item       =   $trigger.closest('.item');
    var item        =   $item.data('item');

    function showHideCaret () {
      if ( item.find('details').hasClass('is-shown') ) {
        $trigger.find('.caret').removeClass('hide');
      }
      else {
        $trigger.find('.caret').addClass('hide');
      }
    }

    if ( item.find('promote').hasClass('is-showing') ) {
      return false;
    }

    if ( item.find('promote').hasClass('is-shown') ) {
      item.find('toggle promote').find('.caret').addClass('hide');
      require('syn/js/providers/Nav').hide(item.find('promote'));
    }

    var hiders = $('.details.is-shown');

    if ( item.find('collapsers hidden').length ) {
      item.find('collapsers').show();
    }

    require('syn/js/providers/Nav').toggle(item.find('details'), item.template, app.domain.intercept(function () {

      showHideCaret();

      if ( item.find('details').hasClass('is-hidden') && item.find('collapsers visible').length ) {
        item.find('collapsers').hide();
      }

      if ( item.find('details').hasClass('is-shown') ) {

        if ( ! item.find('details').hasClass('is-loaded') ) {
          item.find('details').addClass('is-loaded');

          item.details.render(app.domain.intercept());
        }

        if ( hiders.length ) {
          require('syn/js/providers/Nav').hide(hiders);
        }
      }
    }));
  }

  module.exports = toggleDetails;

} ();
