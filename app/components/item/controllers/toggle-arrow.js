'use strict';

/**
 *  Show/Hide children panels
 *  ===
 *
*/

import Nav              from '../../../lib/util/nav';
import PanelCtrl        from '../../../components/panel/ctrl';

function toggleArrow (showSubtype = true, showHarmony = true) {

  let ItemView    =   this.template,
    ItemCtrl      =   this,
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

  let
    subtypeIsShown    = ItemView.find('.subtype-panel').hasClass('is-shown'),
    subtypeIsShowing  = ItemView.find('.subtype-panel').hasClass('is-showing'),
    subtypeIsHidden   = ItemView.find('.subtype-panel').hasClass('is-hidden'),
    subtypeIsHiding   = ItemView.find('.subtype-panel').hasClass('is-hiding'),

    splitIsShown    = ItemView.find('.harmony-panel').hasClass('is-shown'),
    splitIsShowing  = ItemView.find('.harmony-panel').hasClass('is-showing'),
    splitIsHidden   = ItemView.find('.harmony-panel').hasClass('is-hidden'),
    splitIsHiding   = ItemView.find('.harmony-panel').hasClass('is-hiding');

  if ( subtypeIsShown ) {
    Nav.unreveal(ItemView.find('.subtype-panel'), ItemView);
  }
  else if ( subtypeIsHidden || ( ! subtypeIsShowing && ! subtypeIsHiding ) ) {
    if ( showSubtype ) {
      if ( ! ItemView.find('.subtype-panel').length ) {
        loadSubtype();
      }
      else {
        Nav.reveal(ItemView.find('.subtype-panel'), ItemView);
      }
    }
  }

  if ( splitIsShown ) {
    Nav.unreveal(ItemView.find('.harmony-panel'), ItemView);
  }
  else if ( splitIsHidden || ( ! splitIsShowing && ! splitIsHiding ) ) {
    if ( showHarmony ) {
      if ( ! ItemView.find('.harmony-panel').length ) {
        loadHarmony();
      }
      else {
        Nav.reveal(ItemView.find('.harmony-panel'), ItemView);
      }
    }
  }

  let foo22 = () => {
    if ( ItemCtrl.find('children').hasClass('is-shown') ) {

      Nav.unreveal(ItemCtrl.find('children').find('.toggable-panel'), ItemView,
        d.intercept(() => {
          ItemCtrl.find('children').removeClass('is-shown');
      }));
    }

    else {

      Nav.reveal(ItemCtrl.find('children').find('.toggable-panel'), ItemView,
        d.intercept(() => {


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
      }));
    }
  };
  
}

export default toggleArrow;
