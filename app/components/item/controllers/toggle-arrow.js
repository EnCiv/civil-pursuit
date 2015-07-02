'use strict';

import Nav              from 'syn/lib/util/nav';
import Panel            from 'syn/components/panel//ctrl';

function toggleArrow ($trigger) {
  let $item       =   $trigger.closest('.item');
  let item        =   $item.data('item');
  let arrow       =   $trigger.find('i');
  let storeItem   =   this.get('item');

  let d = this.domain;

  if ( item.find('collapsers hidden').length ) {
    item.find('collapsers').show();
  }

  Nav.toggle(item.find('children'), this.template, d.intercept(() => {

      if ( item.find('children').hasClass('is-hidden') && item.find('collapsers visible').length ) {
        item.find('collapsers').hide();
      }

      if ( item.find('children').hasClass('is-shown') && ! item.find('children').hasClass('is-loaded') ) {

        item.find('children').addClass('is-loaded');

        var harmony = storeItem.type.harmony;

        if ( harmony.length ) {
          var split = $('<div class="row"><div class="tablet-50 left-split"></div><div class="tablet-50 right-split"></div></div>');

          item.find('children').append(split);

          console.info('harmony', harmony)

          var panelLeft = new Panel({
            panel : {
              type    :   harmony[0],
              parent  :   storeItem._id
            }
          });

          panelLeft.load();

          panelLeft.template.addClass('split-view');

          split.find('.left-split').append(panelLeft.template);

          setTimeout(function () {
            panelLeft.render(d.intercept(function () {
              panelLeft.fill(d.intercept());
            }));
          });

          var panelRight = new Panel({
            panel : {
              type    : harmony[1],
              parent  : storeItem._id
            }
          });

          panelRight.load();

          panelRight.template.addClass('split-view');

          split.find('.right-split').append(panelRight.template);

          setTimeout(function () {
            panelRight.render(d.intercept(function () {
              panelRight.fill(d.intercept());
            }));
          });
        }

        var subtype = storeItem.subtype;

        if ( subtype ) {
          var subPanel = new Panel({
            panel: {
              type    :   subtype,
              parent  :   storeItem._id
            }
          });

          subPanel.load();

          item.find('children').append(subPanel.template);

          setTimeout(() => {
            subPanel.render(d.intercept(() =>
              subPanel.fill(d.intercept())
            ));
          });
        }
      }

      if ( arrow.hasClass('fa-arrow-down') ) {
        arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
      }
      else {
        arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
      }
    }));
}

export default toggleArrow;