'use strict';

/**
 *  Show/Hide children panels
 *  ===
 *
*/

import Nav              from '../../../lib/util/nav';
import PanelCtrl        from '../../../components/panel/ctrl';

function toggleArrow ($trigger, showSubtype = true, showHarmony = true) {

  let ItemView    =   $trigger.closest('.item'),
    ItemCtrl      =   ItemView.data('item'),
    ItemDocument  =   this.get('item'),
    subType       =   ItemDocument.subtype,
    collapsers    =   {
      hidden      :   !! ItemCtrl.find('collapsers hidden').length
    },
    children      =   {
      loaded      :   !! ItemCtrl.find('children').hasClass('is-loaded'),
      hidden      :   !! ! ItemCtrl.find('children').hasClass('is-shown')
    },

    d             =   this.domain;

  if ( collapsers.hidden ) {
    ItemCtrl.find('collapsers').show();
  }

  let loadHarmony = () => {
    let { harmony } = ItemDocument.type;

    if ( harmony.length && showHarmony ) {
      
      let toggableSplit = Nav.make();

      toggableSplit.addClass('toggable-panel harmony-panel');

      ItemCtrl
        .find('children')
        .append(toggableSplit);

      let split = $('<div class="row"><div class="tablet-50 left-split"></div><div class="tablet-50 right-split"></div></div>');

      toggableSplit.append(split);

      let panelLeft = new PanelCtrl({
        panel     :   {
          type    :   harmony[0],
          parent  :   ItemDocument._id
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

      let panelRight = new PanelCtrl({
        panel     :   {
          type    :   harmony[1],
          parent  :   ItemDocument._id
        }
      });

      panelRight.load();

      panelRight.template.addClass('split-view');

      split.find('.right-split').append(panelRight.template);

      Nav.reveal(toggableSplit, ItemView);

      setTimeout(function () {
        panelRight.render(d.intercept(function () {
          panelRight.fill(d.intercept());
        }));
      });

      ItemCtrl.find('children').addClass('harmony-loaded');

    }
  };

  let loadSubtype = () => {
    if ( subType && showSubtype ) {

      let toggableSubType = Nav.make();

      toggableSubType.addClass('toggable-panel subtype-panel');

      let subPanel = new PanelCtrl({
        panel     :   {
          type    :   subType,
          parent  :   ItemDocument._id
        }
      });

      subPanel
        .load();

      toggableSubType.append(subPanel.template);

      Nav.reveal(toggableSubType, ItemView);

      ItemCtrl
        .find('children')
        .append(toggableSubType);

      setTimeout(() => {
        subPanel.render(d.intercept(() =>
          subPanel.fill(d.intercept())
        ));
      });

      ItemCtrl.find('children').addClass('subtype-loaded');
    }
  };

  if ( ItemCtrl.find('children').hasClass('is-shown') ) {
    console.info('Hide children');

    Nav.unreveal(ItemCtrl.find('children').find('.toggable-panel'), ItemView,
      d.intercept(() => {
        ItemCtrl.find('children').removeClass('is-shown');

        $trigger
          .find('i.fa')
          .removeClass('fa-arrow-up')
          .addClass('fa-arrow-down');
    }));
  }

  else {

    console.info('Show children');

    Nav.reveal(ItemCtrl.find('children').find('.toggable-panel'), ItemView,
      d.intercept(() => {

        console.log('Children shown');

        if ( ! ItemCtrl.find('children').hasClass('harmony-loaded') ) {
          loadHarmony();
        }

        else if ( ! showHarmony ) {
          ItemCtrl.find('children').find('.harmony-panel').hide();
        }

        else {
          ItemCtrl.find('children').find('.harmony-panel').show();
        }

        if ( ! ItemCtrl.find('children').hasClass('subtype-loaded') ) {
          loadSubtype();
        }

        else if ( ! showSubtype ) {
          ItemCtrl.find('children').find('.subtype-panel').hide();
        }

        else {
          ItemCtrl.find('children').find('.subtype-panel').show();
        }
        
        ItemCtrl.find('children').addClass('is-shown');

        $trigger
          .find('i.fa')
          .removeClass('fa-arrow-down')
          .addClass('fa-arrow-up');
    }));
  }
  
}

// function old () {
//   Nav.toggle(item.find('children'), this.template, d.intercept(() => {
//     if ( item.find('children').hasClass('is-hidden') && item.find('collapsers visible').length ) {
//       item.find('collapsers').hide();
//     }

//     if ( item.find('children').hasClass('is-shown') && ! item.find('children').hasClass('is-loaded') ) {

//       item.find('children').addClass('is-loaded');

//       var harmony = storeItem.type.harmony;

//       if ( harmony.length ) {
//         var split = $('<div class="row"><div class="tablet-50 left-split"></div><div class="tablet-50 right-split"></div></div>');

//         item.find('children').append(split);


//       }

//       var subtype = storeItem.subtype;

//       if ( subtype ) {
//         var subPanel = new Panel({
//           panel: {
//             type    :   subtype,
//             parent  :   storeItem._id
//           }
//         });

//         subPanel.load();

//         item.find('children').append(subPanel.template);

//         setTimeout(() => {
//           subPanel.render(d.intercept(() =>
//             subPanel.fill(d.intercept())
//           ));
//         });
//       }
//     }

//     if ( arrow.hasClass('fa-arrow-down') ) {
//       arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
//     }
//     else {
//       arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
//     }
//   }));
// }

export default toggleArrow;