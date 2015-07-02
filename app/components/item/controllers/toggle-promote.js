'use strict';

import Nav              from 'syn/lib/util/nav';
import TopBar           from 'syn/components/top-bar//ctrl';

function tooglePromote ($trigger) {

    if ( ! this.socket.synuser ) {
      let topbar = new TopBar();
      topbar.find('join button').click();
      return;
    }

    let $item       =   $trigger.closest('.item');
    let item        =   $item.data('item');

    let d = this.domain;

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
      item.promote.getEvaluation(d.intercept(item.promote.render.bind(item.promote)));
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

export default tooglePromote;
